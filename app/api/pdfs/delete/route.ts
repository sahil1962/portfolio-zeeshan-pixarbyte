import { NextRequest, NextResponse } from 'next/server';
import { deletePDF } from '@/app/lib/r2';

// Force Node.js runtime to avoid Turbopack bundling issues
export const runtime = 'nodejs';

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { error: 'PDF key is required' },
        { status: 400 }
      );
    }

    await deletePDF(key);

    return NextResponse.json({
      success: true,
      message: 'PDF deleted successfully',
    });

  } catch (error) {
    console.error('Delete PDF error:', error);
    return NextResponse.json(
      { error: 'Failed to delete PDF' },
      { status: 500 }
    );
  }
}
