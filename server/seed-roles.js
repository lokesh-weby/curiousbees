const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Checking current users in DB ---');
  const users = await prisma.user.findMany();
  
  let facultyCount = 0;
  
  for (const user of users) {
    console.log(`User: ${user.email}, Role: ${user.role}, Approved: ${user.approved}`);
    
    // Convert old roles to new roles if they somehow stuck as old values 
    // Prisma will complain if the old string isn't in the new enum, 
    // but we can update them safely by relying on the current prefix mapping.
    
    let newRole = user.role;
    let newApproved = user.approved;
    
    if (user.email.startsWith('faculty') || user.role === 'FACULTY') {
      newRole = 'RESEARCH_SUPERVISOR';
      newApproved = true;
      facultyCount++;
    } else if (user.email.startsWith('admin') || user.role === 'ADMIN') {
      newRole = 'INSTITUTION_ADMIN';
      newApproved = true;
    } else if (user.email.startsWith('scholar') || user.role === 'PHD_SCHOLAR') {
      newRole = 'RESEARCH_SCHOLAR';
    }
    
    if (newRole !== user.role || newApproved !== user.approved) {
      console.log(`--> Updating ${user.email} to Role: ${newRole}, Approved: ${newApproved}`);
      await prisma.$executeRawUnsafe(`UPDATE "User" SET role = $1, approved = $2 WHERE id = $3`, newRole, newApproved, user.id);
    }
  }

  // Seed sample supervisors if none exist
  if (facultyCount === 0) {
    console.log('No faculty found. Seeding sample supervisors...');
    const supervisors = [
      { email: 'facultyda@gmail.com', name: 'Dr. Da' },
      { email: 'facultykumar@gmail.com', name: 'Dr. Kumar' },
      { email: 'facultyresearch@gmail.com', name: 'Dr. Research' }
    ];
    
    for (const sup of supervisors) {
      const existing = await prisma.user.findUnique({ where: { email: sup.email } });
      if (!existing) {
        await prisma.user.create({
          data: {
            email: sup.email,
            name: sup.name,
            role: 'RESEARCH_SUPERVISOR',
            approved: true,
            emailVerified: new Date(),
          }
        });
        console.log(`--> Seeded ${sup.email}`);
      }
    }
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
