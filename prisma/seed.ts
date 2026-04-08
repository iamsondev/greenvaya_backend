import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcrypt';

async function main() {
  const adminEmail = 'admin@gmail.com';
  const adminPassword = 'admin1234';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    await prisma.user.create({
      data: {
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN', // Using string value as per Role enum
        isActive: true,
      },
    });

    console.log('Admin user created successfully!');
  } else {
    console.log('Admin user already exists.');
  }

  // Check if moderator already exists
  const moderatorEmail = 'moderator@gmail.com';
  const existingModerator = await prisma.user.findUnique({
    where: { email: moderatorEmail },
  });

  if (!existingModerator) {
    const hashedPassword = await bcrypt.hash('moderator1234', 12);

    await prisma.user.create({
      data: {
        name: 'Moderator',
        email: moderatorEmail,
        password: hashedPassword,
        role: 'MODERATOR',
        isActive: true,
      },
    });

    console.log('Moderator user created successfully!');
  } else {
    console.log('Moderator user already exists.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
