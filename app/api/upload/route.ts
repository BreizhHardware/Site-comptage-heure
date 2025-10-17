import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file = data.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 });
  }

  if (file.size > 2 * 1024 * 1024) {
    // 2Mo
    return NextResponse.json({ error: 'Fichier trop grand' }, { status: 400 });
  }

  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: 'Type de fichier non autorisé' },
      { status: 400 },
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${file.name}`;
  const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

  await mkdir(path.dirname(filepath), { recursive: true });
  await writeFile(filepath, buffer);

  return NextResponse.json({ path: `/uploads/${filename}` });
}
