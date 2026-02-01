import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, degrees } from 'pdf-lib';
import { SUPPORTED_EXTENSIONS } from '@/app/lib/r2';

// Force Node.js runtime
export const runtime = 'nodejs';

const PREVIEW_PAGES = 2; // Number of pages to show in preview

// Check if file is a PDF based on key/extension
function isPdfFile(key: string): boolean {
  return key.toLowerCase().endsWith('.pdf');
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { success: false, error: 'File key is required' },
        { status: 400 }
      );
    }

    // Check if file extension is supported
    const fileExt = '.' + key.split('.').pop()?.toLowerCase();
    if (!SUPPORTED_EXTENSIONS.includes(fileExt)) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file type' },
        { status: 400 }
      );
    }

    // For non-PDF files, return a message that preview isn't available
    if (!isPdfFile(key)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Preview not available for this file type. Please purchase to download.',
          fileType: fileExt
        },
        { status: 400 }
      );
    }

    // Verify environment variables
    if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID ||
        !process.env.R2_SECRET_ACCESS_KEY || !process.env.R2_BUCKET_NAME) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Get PDF from R2
    const { S3Client, GetObjectCommand } = await import('@aws-sdk/client-s3');
    const client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });

    const response = await client.send(command);

    if (!response.Body) {
      return NextResponse.json(
        { success: false, error: 'File not found' },
        { status: 404 }
      );
    }

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
      chunks.push(chunk);
    }
    const pdfBuffer = Buffer.concat(chunks);

    // Load the PDF
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const totalPages = pdfDoc.getPageCount();

    // Create a new PDF with only the preview pages
    const previewPdf = await PDFDocument.create();

    // Copy only the first N pages
    const pagesToCopy = Math.min(PREVIEW_PAGES, totalPages);
    const copiedPages = await previewPdf.copyPages(pdfDoc, Array.from({ length: pagesToCopy }, (_, i) => i));

    copiedPages.forEach((page) => {
      previewPdf.addPage(page);
    });

    // Add watermark to each page
    const pages = previewPdf.getPages();
    const font = await previewPdf.embedFont('Helvetica-Bold');

    for (const page of pages) {
      const { width, height } = page.getSize();

      // Add "Zeeshan" watermark
      page.drawText('Zeeshan', {
        x: width / 2 - 100,
        y: height / 2 - 10,
        size: 60,
        opacity: 0.2,
        rotate: degrees(-45),
      });
    }

    // Add info page at the end
    const infoPage = previewPdf.addPage();
    const { width: infoWidth, height: infoHeight } = infoPage.getSize();

    infoPage.drawText('Preview Only', {
      x: infoWidth / 2 - 80,
      y: infoHeight / 2 + 100,
      size: 30,
      font,
    });

    infoPage.drawText(`Showing ${pagesToCopy} of ${totalPages} pages`, {
      x: infoWidth / 2 - 120,
      y: infoHeight / 2 + 50,
      size: 20,
      font,
    });

    infoPage.drawText('Purchase the full document to access all pages', {
      x: infoWidth / 2 - 180,
      y: infoHeight / 2,
      size: 14,
      font,
    });

    // Generate the preview PDF
    const previewPdfBytes = await previewPdf.save();

    // Return the preview PDF
    return new NextResponse(Buffer.from(previewPdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="preview-${key.split('/').pop()}"`,
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error('Preview generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate preview' },
      { status: 500 }
    );
  }
}
