const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('test', 10); // Changez le mot de passe ici
  await prisma.user.upsert({
    where: { email: 'test@test.fr' },
    update: {},
    create: {
      email: 'test@test.fr',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      id: uuidv4(), // Ajout d'un identifiant unique
    },
  });
  console.log('Super admin created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
