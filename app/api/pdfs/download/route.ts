import { NextRequest, NextResponse } from 'next/server';
import { getPresignedDownloadUrl } from '@/app/lib/r2';

// Force Node.js runtime to avoid Turbopack bundling issues
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { error: 'PDF key is required' },
        { status: 400 }
      );
    }

    // Generate presigned URL (expires in 1 hour)
    const downloadUrl = await getPresignedDownloadUrl(key);

    return NextResponse.json({
      success: true,
      data: {
        downloadUrl,
        expiresIn: 3600, // seconds
      },
    });

  } catch (error) {
    console.error('Download URL generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate download URL' },
      { status: 500 }
    );
  }
}
