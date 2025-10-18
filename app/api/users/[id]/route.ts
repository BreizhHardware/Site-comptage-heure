import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const { force = false } = body;

  const user = await prisma.user.findUnique({
    where: { id },
    include: { hours: true },
  });

  if (!user) {
    return NextResponse.json(
      { error: 'Utilisateur non trouvé' },
      { status: 404 },
    );
  }

  if (user.hours.length > 0 && !force) {
    return NextResponse.json(
      { error: 'Impossible de supprimer un utilisateur avec des heures' },
      { status: 400 },
    );
  }

  if (force && user.hours.length > 0) {
    await prisma.hour.deleteMany({
      where: { userId: id },
    });
  }

  await prisma.user.delete({
    where: { id },
  });

  return NextResponse.json({ message: 'Utilisateur supprimé' });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const { password } = await request.json();
  if (!password) {
    return NextResponse.json({ error: 'Mot de passe requis' }, { status: 400 });
  }

  const { id } = await params;

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id },
    data: { password: hashedPassword },
  });

  return NextResponse.json({ message: 'Mot de passe mis à jour' });
}
