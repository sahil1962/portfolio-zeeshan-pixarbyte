// app/api/pdfs/list/route.ts

import { NextResponse } from 'next/server';
import { listPDFs } from '@/app/lib/r2';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // ← THIS IS REQUIRED ON HOSTINGER

export async function GET() {
  try {
    console.log('ENV CHECK', {
      account: !!process.env.R2_ACCOUNT_ID,
      key: !!process.env.R2_ACCESS_KEY_ID,
      secret: !!process.env.R2_SECRET_ACCESS_KEY,
      bucket: !!process.env.R2_BUCKET_NAME,
    });

    if (
      !process.env.R2_ACCOUNT_ID ||
      !process.env.R2_ACCESS_KEY_ID ||
      !process.env.R2_SECRET_ACCESS_KEY ||
      !process.env.R2_BUCKET_NAME
    ) {
      return NextResponse.json(
        { success: false, error: 'Server configuration error: Missing R2 credentials' },
        { status: 500 }
      );
    }

    const pdfs = await listPDFs();

    return NextResponse.json({ success: true, data: pdfs });
  } catch (error) {
    console.error('List PDFs error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to list PDFs' },
      { status: 500 }
    );
  }
}
