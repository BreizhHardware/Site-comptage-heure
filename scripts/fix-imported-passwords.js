const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Updating passwords for users requiring reset...');
  
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const result = await prisma.user.updateMany({
    where: {
      passwordResetRequired: true,
    },
    data: {
      password: hashedPassword,
    },
  });

  console.log(`Updated ${result.count} users with temporary password "123456"`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
