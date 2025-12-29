import { NextResponse } from 'next/server';
import { listPDFs } from '@/app/lib/r2';

// Force Node.js runtime to avoid Turbopack bundling issues
export const runtime = 'nodejs';

export async function GET() {
  try {
    // Check if environment variables are set
    if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY || !process.env.R2_BUCKET_NAME) {
      console.error('Missing R2 environment variables');
      return NextResponse.json(
        { success: false, error: 'Server configuration error: Missing R2 credentials' },
        { status: 500 }
      );
    }

    const pdfs = await listPDFs();

    return NextResponse.json({
      success: true,
      data: pdfs,
    });

  } catch (error) {
    console.error('List PDFs error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list PDFs'
      },
      { status: 500 }
    );
  }
}
