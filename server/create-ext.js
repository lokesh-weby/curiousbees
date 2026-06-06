const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS vector;');
    console.log('Successfully created vector extension.');
  } catch (e) {
    console.error('Error creating vector extension:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
