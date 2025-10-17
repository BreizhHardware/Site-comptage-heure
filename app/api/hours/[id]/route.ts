import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { prisma } from '../../../../lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')
  ) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const { status } = await request.json();

  if (!['VALIDATED', 'REJECTED'].includes(status)) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
  }

  const { id } = await params;

  const hour = await prisma.hour.update({
    where: { id },
    data: {
      status,
      validatedBy: session.user.id,
    },
  });

  return NextResponse.json(hour);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')
  ) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const { id } = await params;

  const hour = await prisma.hour.findUnique({
    where: { id },
  });

  if (!hour || (hour.status !== 'VALIDATED' && hour.status !== 'REJECTED')) {
    return NextResponse.json(
      { error: 'Heure non trouvée ou non validée/rejetée' },
      { status: 404 },
    );
  }

  await prisma.hour.delete({
    where: { id },
  });

  return NextResponse.json({ message: 'Heure supprimée' });
}
