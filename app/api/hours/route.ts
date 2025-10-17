import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const userId = session.user.id;
  const role = session.user.role;

  let hours;
  if (role === 'MEMBER') {
    hours = await prisma.hour.findMany({
      where: { userId },
      select: {
        id: true,
        date: true,
        duration: true,
        reason: true,
        status: true,
        userId: true,
        user: { select: { email: true, firstName: true, lastName: true } },
      },
    });
  } else if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
    hours = await prisma.hour.findMany({
      select: {
        id: true,
        date: true,
        duration: true,
        reason: true,
        status: true,
        userId: true,
        user: {
          select: { email: true, firstName: true, lastName: true, role: true },
        },
      },
    });
  } else {
    return NextResponse.json({ error: 'Rôle non autorisé' }, { status: 403 });
  }

  return NextResponse.json(hours);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (
    !session ||
    (session.user.role !== 'MEMBER' &&
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'SUPER_ADMIN')
  ) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const { date, duration, reason } = await request.json();

  if (!date || !duration || !reason) {
    return NextResponse.json(
      { error: 'Champs requis manquants' },
      { status: 400 },
    );
  }

  const userId = session.user.id;

  const hour = await prisma.hour.create({
    data: {
      id: uuidv4(),
      date: new Date(date),
      duration,
      reason,
      userId,
    },
  });

  return NextResponse.json(hour);
}
