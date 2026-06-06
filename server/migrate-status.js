const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting User Status Migration ---');

  const users = await prisma.user.findMany();
  console.log(`Found ${users.length} users to evaluate.`);

  let updatedCount = 0;

  for (const user of users) {
    let newStatus = 'PENDING_SUPERVISOR';

    if (user.approved) {
      newStatus = 'APPROVED';
    } else if (user.supervisorId) {
      newStatus = 'PENDING_SUPERVISOR';
    } else if (user.role === 'RESEARCH_SUPERVISOR') {
      newStatus = 'PENDING_ADMIN';
    }

    // Only update if it differs
    if (user.status !== newStatus) {
      await prisma.user.update({
        where: { id: user.id },
        data: { status: newStatus }
      });
      console.log(`Migrated user ${user.email} to status: ${newStatus}`);
      updatedCount++;
    }
  }

  console.log(`--- Migration complete! Updated ${updatedCount} users. ---`);
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
