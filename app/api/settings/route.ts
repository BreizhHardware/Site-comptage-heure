import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const settings = await prisma.clubSettings.findFirst();
  return NextResponse.json(settings || { name: '', logo: '' });
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')
  ) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const { name, logo } = await request.json();

  const settings = await prisma.clubSettings.upsert({
    where: { id: 'settings' },
    update: { name, logo },
    create: { name, logo },
  });

  return NextResponse.json(settings);
}
