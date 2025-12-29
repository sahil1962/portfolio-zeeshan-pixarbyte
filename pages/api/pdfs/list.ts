// pages/api/pdfs/list.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { listPDFs } from '@/app/lib/r2';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (
      !process.env.NEXT_PUBLIC_R2_ACCOUNT_ID ||
      !process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID ||
      !process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY ||
      !process.env.NEXT_PUBLIC_R2_BUCKET_NAME ||
      !process.env.NEXT_PUBLIC_R2_PUBLIC_URL
    ) {
      console.error('Missing R2 environment variables');
      return res.status(500).json({
        success: false,
        error: 'Server configuration error: Missing R2 credentials',
      });
    }

    const pdfs = await listPDFs();

    return res.status(200).json({
      success: true,
      data: pdfs,
    });
  } catch (error) {
    console.error('List PDFs error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to list PDFs',
    });
  }
}
