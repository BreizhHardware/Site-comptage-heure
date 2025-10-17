import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const { email, password, role, firstName, lastName } = await request.json();

  if (!email || !password || !role || !firstName || !lastName) {
    return NextResponse.json(
      { error: 'Champs requis manquants' },
      { status: 400 },
    );
  }

  if (!['MEMBER', 'ADMIN'].includes(role)) {
    return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: 'Utilisateur déjà existant' },
      { status: 400 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      id: uuidv4(),
      email,
      password: hashedPassword,
      role,
      firstName,
      lastName,
    },
  });

  return NextResponse.json({
    message: 'Utilisateur créé',
    user: { id: user.id, email: user.email, role: user.role },
  });
}
