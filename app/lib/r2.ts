// Dynamic imports to work with Turbopack on Windows
const BUCKET_NAME = process.env.R2_BUCKET_NAME || '';

export interface PDFMetadata {
  key: string;
  name: string;
  size: number;
  uploadedAt: Date;
  title?: string;
  description?: string;
  price?: string;
  pages?: string;
  topics?: string;
}

export interface PDFMetadataWithUrl extends PDFMetadata {
  url: string;
}

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
 * Upload a PDF file to R2 bucket
 */
export async function uploadPDF(file: Buffer, fileName: string, metadata?: Record<string, string>): Promise<PDFMetadata> {
  const { PutObjectCommand } = await import('@aws-sdk/client-s3');
  const client = await getS3Client();

  const key = `pdfs/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: 'application/pdf',
    Metadata: metadata,
  });

  await client.send(command);

  return {
    key,
    name: fileName,
    size: file.length,
    uploadedAt: new Date(),
  };
}

/**
 * List all PDFs in the bucket with metadata (without URLs for security)
 */
export async function listPDFs(): Promise<PDFMetadata[]> {
  const { ListObjectsV2Command, HeadObjectCommand } = await import('@aws-sdk/client-s3');
  const client = await getS3Client();

  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
  });

  const response = await client.send(command);

  if (!response.Contents) {
    return [];
  }

  // Filter to only include PDF files
  const pdfItems = response.Contents.filter(item => item.Key?.toLowerCase().endsWith('.pdf'));

  // Fetch metadata for each PDF
  const pdfsWithMetadata = await Promise.all(
    pdfItems.map(async (item) => {
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

  return pdfsWithMetadata;
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
 * Delete a PDF from the bucket
 */
export async function deletePDF(key: string): Promise<void> {
  const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
  const client = await getS3Client();

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await client.send(command);
}
