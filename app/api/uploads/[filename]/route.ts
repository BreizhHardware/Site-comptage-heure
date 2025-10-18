import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import mime from 'mime-types';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;

  const filepath = path.join(process.cwd(), 'uploads', filename);

  try {
    const file = await readFile(filepath);
    const mimeType = mime.lookup(filename) || 'application/octet-stream';

    const uint8Array = new Uint8Array(file);

    return new NextResponse(uint8Array as any, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
