import 'dotenv/config';
import { Server } from 'http';
import app from './app';
import { prisma } from './lib/prisma';

let server: Server;

async function bootstrap() {
  try {
    // Connect to DB first
    await prisma.$connect();
    console.log('🗄️  Database connected successfully');

    server = app.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();


// Handle unhandledRejection (for asynchronous errors)
process.on('unhandledRejection', (error) => {
  console.log(`😈 unhandledRejection is detected, shutting down ...`, error);
  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(1);
    });
  } else {
    prisma.$disconnect().then(() => process.exit(1));
  }
});

// Handle uncaughtException (for synchronous errors)
process.on('uncaughtException', async (error) => {
  console.log(`😈 uncaughtException is detected, shutting down ...`, error);
  await prisma.$disconnect();
  process.exit(1);
});

// Graceful shutdown on SIGTERM (e.g., from deployment tools)
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully.');
  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
      console.log('🛑 Process terminated!');
    });
  } else {
    prisma.$disconnect().then(() => process.exit(0));
  }
});

// Graceful shutdown on SIGINT (e.g., Ctrl+C)
process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down gracefully.');
  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
      console.log('🛑 Process terminated!');
      process.exit(0);
    });
  } else {
    prisma.$disconnect().then(() => process.exit(0));
  }
});