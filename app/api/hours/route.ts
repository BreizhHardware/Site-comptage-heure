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
        validatedBy: {
          select: { firstName: true, lastName: true, email: true },
        },
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
        validatedBy: {
          select: { firstName: true, lastName: true, email: true },
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

  const { date, duration, reason, userIds } = await request.json();

  if (!date || !duration || !reason) {
    return NextResponse.json(
      { error: 'Champs requis manquants' },
      { status: 400 },
    );
  }

  let targetUserIds = [session.user.id];
  let status = 'PENDING';
  let validatedById = undefined;

  if (userIds && Array.isArray(userIds) && userIds.length > 0) {
    if (session.user.role === 'ADMIN' || session.user.role === 'SUPER_ADMIN') {
      targetUserIds = userIds;
      status = 'VALIDATED';
      validatedById = session.user.id;
    } else {
      return NextResponse.json(
        { error: "Non autorisé à ajouter des heures pour d'autres utilisateurs" },
        { status: 403 },
      );
    }
  }

  const createdHours = [];

  for (const uid of targetUserIds) {
    const hour = await prisma.hour.create({
      data: {
        id: uuidv4(),
        date: new Date(date),
        duration,
        reason,
        userId: uid,
        status: status as any,
        validatedById,
      },
    });
    createdHours.push(hour);
  }

  return NextResponse.json(createdHours);
}
