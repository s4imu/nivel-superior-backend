import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.createMany({
    data: [
      {
        name: 'Super',
        email: 'super@email.com',
        role: 'SUPER',
        password: 'Super@123',
      },
      {
        name: 'Admin',
        email: 'admin@email.com',
        role: 'ADMIN',
        password: 'Admin@123',
      },
    ],
    skipDuplicates: true,
  });
}
seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
