import { NextRequest, NextResponse } from 'next/server';
import { uploadPDF } from '@/app/lib/r2';

// Force Node.js runtime to avoid Turbopack bundling issues
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Verify environment variables are set
    if (!process.env.NEXT_PUBLIC_R2_ACCOUNT_ID || !process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID ||
        !process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY || !process.env.NEXT_PUBLIC_R2_BUCKET_NAME) {
      console.error('Missing R2 environment variables');
      return NextResponse.json(
        { success: false, error: 'Server configuration error: Missing R2 credentials' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 50MB' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get optional metadata from form
    const title = formData.get('title') as string || file.name;
    const description = formData.get('description') as string || '';
    const price = formData.get('price') as string || '0';
    const pages = formData.get('pages') as string || '0';
    const topics = formData.get('topics') as string || '';

    // Upload to R2
    const metadata = await uploadPDF(buffer, file.name, {
      title,
      description,
      price,
      pages,
      topics,
    });

    return NextResponse.json({
      success: true,
      data: metadata,
    });

  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
