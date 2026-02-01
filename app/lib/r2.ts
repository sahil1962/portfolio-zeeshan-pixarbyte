// Dynamic imports to work with Turbopack on Windows
const BUCKET_NAME = process.env.R2_BUCKET_NAME || '';

// Supported file types for upload
export const SUPPORTED_FILE_TYPES: Record<string, string> = {
  'application/pdf': '.pdf',
  'application/vnd.ms-powerpoint': '.ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.ms-excel': '.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
};

export const SUPPORTED_EXTENSIONS = ['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.xls', '.xlsx'];

export interface FileMetadata {
  key: string;
  name: string;
  size: number;
  uploadedAt: Date;
  title?: string;
  description?: string;
  price?: string;
  pages?: string;
  topics?: string;
  fileType?: string;
}

export interface FileMetadataWithUrl extends FileMetadata {
  url: string;
}

// Keep old names for backwards compatibility
export type PDFMetadata = FileMetadata;
export type PDFMetadataWithUrl = FileMetadataWithUrl;

// Helper to get S3 client with dynamic import
async function getS3Client() {
  const { S3Client } = await import('@aws-sdk/client-s3');

  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
  });
}

/**
 * Upload a file to R2 bucket (supports PDFs, PowerPoints, Word docs, Excel)
 */
export async function uploadFile(
  file: Buffer,
  fileName: string,
  contentType: string,
  metadata?: Record<string, string>
): Promise<FileMetadata> {
  const { PutObjectCommand } = await import('@aws-sdk/client-s3');
  const client = await getS3Client();

  const key = `files/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
    Metadata: { ...metadata, fileType: contentType },
  });

  await client.send(command);

  return {
    key,
    name: fileName,
    size: file.length,
    uploadedAt: new Date(),
    fileType: contentType,
  };
}

/**
 * Upload a PDF file to R2 bucket (legacy function for backwards compatibility)
 */
export async function uploadPDF(
  file: Buffer,
  fileName: string,
  metadata?: Record<string, string>
): Promise<FileMetadata> {
  return uploadFile(file, fileName, 'application/pdf', metadata);
}

/**
 * List all files in the bucket with metadata (without URLs for security)
 */
export async function listFiles(): Promise<FileMetadata[]> {
  const { ListObjectsV2Command, HeadObjectCommand } = await import('@aws-sdk/client-s3');
  const client = await getS3Client();

  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
  });

  const response = await client.send(command);

  if (!response.Contents) {
    return [];
  }

  // Filter to only include supported file types
  const supportedItems = response.Contents.filter(item => {
    const key = item.Key?.toLowerCase() || '';
    return SUPPORTED_EXTENSIONS.some(ext => key.endsWith(ext));
  });

  // Fetch metadata for each file
  const filesWithMetadata = await Promise.all(
    supportedItems.map(async (item) => {
      try {
        // Get metadata for this file
        const headCommand = new HeadObjectCommand({
          Bucket: BUCKET_NAME,
          Key: item.Key,
        });
        const headResponse = await client.send(headCommand);

        return {
          key: item.Key || '',
          name: item.Key?.split('/').pop() || item.Key || '',
          size: item.Size || 0,
          uploadedAt: item.LastModified || new Date(),
          // Include metadata from upload
          title: headResponse.Metadata?.title,
          description: headResponse.Metadata?.description,
          price: headResponse.Metadata?.price,
          pages: headResponse.Metadata?.pages,
          topics: headResponse.Metadata?.topics,
          fileType: headResponse.Metadata?.filetype || headResponse.ContentType,
        };
      } catch (error) {
        console.error(`Error fetching metadata for ${item.Key}:`, error);
        // Return basic info if metadata fetch fails
        return {
          key: item.Key || '',
          name: item.Key?.split('/').pop() || item.Key || '',
          size: item.Size || 0,
          uploadedAt: item.LastModified || new Date(),
        };
      }
    })
  );

  return filesWithMetadata;
}

/**
 * List all PDFs in the bucket (legacy function for backwards compatibility)
 */
export async function listPDFs(): Promise<FileMetadata[]> {
  return listFiles();
}

/**
 * Get a presigned URL for downloading a PDF
 * @param key - The R2 object key
 * @param expiresIn - Expiry time in seconds (default: 3600 = 1 hour)
 */
export async function getPresignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const { GetObjectCommand } = await import('@aws-sdk/client-s3');
  const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
  const client = await getS3Client();

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(client, command, { expiresIn });
}

/**
 * Delete a file from the bucket
 */
export async function deleteFile(key: string): Promise<void> {
  const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
  const client = await getS3Client();

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await client.send(command);
}

/**
 * Delete a PDF from the bucket (legacy function for backwards compatibility)
 */
export async function deletePDF(key: string): Promise<void> {
  return deleteFile(key);
}
