import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create users with Ethiopian names
  const user1 = await prisma.user.create({
    data: {
      username: 'abebe_kebede',
      email: 'abebe.kebede@example.com',
      password: 'securepassword1', // Note: Hash passwords in production
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: 'alemu_tadesse',
      email: 'alemutadesse@example.com',
      password: 'securepassword2',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      username: 'desta_mebratu',
      email: 'desta.mebratu@example.com',
      password: 'securepassword3',
    },
  });

  // Create accounts for each user
  await prisma.account.create({
    data: {
      userId: user1.id,
      balance: 1000.0,
    },
  });

  await prisma.account.create({
    data: {
      userId: user2.id,
      balance: 2000.0,
    },
  });

  await prisma.account.create({
    data: {
      userId: user3.id,
      balance: 1500.0,
    },
  });

  console.log('Seed user with account created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
