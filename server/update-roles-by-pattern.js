const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function detectRoleFromEmail(email) {
  const normalized = email.trim().toLowerCase();
  const username = normalized.split('@')[0];

  if (username.includes('.')) {
    return { role: 'INSTITUTION_ADMIN', approved: true };
  } else if (/[a-zA-Z]/.test(username) && /[0-9]/.test(username)) {
    return { role: 'RESEARCH_SCHOLAR', approved: false };
  } else if (/^[a-zA-Z]+$/.test(username)) {
    return { role: 'RESEARCH_SUPERVISOR', approved: true };
  }
  
  return { role: 'RESEARCH_SCHOLAR', approved: false };
}

async function main() {
  console.log('--- Auditing user roles based on new patterns (Existing roles protected) ---');
  
  const users = await prisma.user.findMany();

  for (const user of users) {
    const { role: newRole, approved: newApproved } = detectRoleFromEmail(user.email);
    
    // Protect existing roles: do not overwrite them if they are already set in the database.
    // We only update if the user's role is not yet defined, but since role defaults to RESEARCH_SCHOLAR,
    // we only allow updating if it is a dry-run or we print the mismatch without changing it.
    if (user.role !== newRole) {
      console.log(`[PROTECTED] Mismatch detected for ${user.email}: DB has '${user.role}', pattern suggests '${newRole}'. Not overwriting.`);
    } else if (user.approved !== newApproved) {
      // If the role matches but approval status differs, we can sync the approval status safely 
      // if the user is not a scholar (admins and supervisors are pre-approved).
      if (user.role === 'INSTITUTION_ADMIN' || user.role === 'RESEARCH_SUPERVISOR') {
        await prisma.$executeRawUnsafe(`UPDATE "User" SET approved = $1 WHERE id = $2`, newApproved, user.id);
        console.log(`Updated approval status for ${user.email} to ${newApproved}`);
      }
    } else {
      console.log(`Skipped ${user.email} -> Already matches ${newRole} (approved: ${newApproved})`);
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
