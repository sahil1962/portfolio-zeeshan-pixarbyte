// app/lib/r2.ts

export interface PDFMetadata {
  key: string;
  name: string;
  size: number;
  uploadedAt: Date;
  url: string;
  title?: string;
  description?: string;
  price?: string;
  pages?: string;
  topics?: string;
}

// Helper to validate and get environment variables
function getR2Config() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;
  const publicUrl = process.env.R2_PUBLIC_URL;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
    throw new Error('Missing required R2 environment variables');
  }

  return { accountId, accessKeyId, secretAccessKey, bucketName, publicUrl };
}

// Helper to get S3 client with dynamic import
async function getS3Client() {
  const { S3Client } = await import('@aws-sdk/client-s3');
  const config = getR2Config();

  return new S3Client({
    region: 'auto',
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

/**
 * Upload a PDF file to R2 bucket
 */
export async function uploadPDF(file: Buffer, fileName: string, metadata?: Record<string, string>): Promise<PDFMetadata> {
  const { PutObjectCommand } = await import('@aws-sdk/client-s3');
  const client = await getS3Client();
  const config = getR2Config();

  const key = `pdfs/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: config.bucketName,
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
    url: `${config.publicUrl}/${key}`,
  };
}

/**
 * List all PDFs in the bucket with metadata
 */
export async function listPDFs(): Promise<PDFMetadata[]> {
  const { ListObjectsV2Command, HeadObjectCommand } = await import('@aws-sdk/client-s3');
  const client = await getS3Client();
  const config = getR2Config();

  const command = new ListObjectsV2Command({
    Bucket: config.bucketName,
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
          Bucket: config.bucketName,
          Key: item.Key,
        });
        const headResponse = await client.send(headCommand);

        return {
          key: item.Key || '',
          name: item.Key?.split('/').pop() || item.Key || '',
          size: item.Size || 0,
          uploadedAt: item.LastModified || new Date(),
          url: `${config.publicUrl}/${item.Key}`,
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
          url: `${config.publicUrl}/${item.Key}`,
        };
      }
    })
  );

  return pdfsWithMetadata;
}

/**
 * Get a presigned URL for downloading a PDF (expires in 1 hour)
 */
export async function getPresignedDownloadUrl(key: string): Promise<string> {
  const { GetObjectCommand } = await import('@aws-sdk/client-s3');
  const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
  const client = await getS3Client();
  const config = getR2Config();

  const command = new GetObjectCommand({
    Bucket: config.bucketName,
    Key: key,
  });

  return await getSignedUrl(client, command, { expiresIn: 3600 });
}

/**
 * Delete a PDF from the bucket
 */
export async function deletePDF(key: string): Promise<void> {
  const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
  const client = await getS3Client();
  const config = getR2Config();

  const command = new DeleteObjectCommand({
    Bucket: config.bucketName,
    Key: key,
  });

  await client.send(command);
}
