/**
 * migrate-roles.js
 *
 * One-time migration script: converts legacy role values to the current enum.
 *
 * Legacy → Current Mapping:
 *   FACULTY        → RESEARCH_SUPERVISOR  (approved = true)
 *   PHD_SCHOLAR    → RESEARCH_SCHOLAR     (approved unchanged)
 *   ADMIN          → INSTITUTION_ADMIN    (approved = true)
 *
 * Usage (from apps/api directory):
 *   node migrate-roles.js
 *
 * Safe to run multiple times — uses raw SQL UPDATE with WHERE clauses
 * that are no-ops if no legacy records exist.
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('[MIGRATE] Starting role migration...');

  // 1. FACULTY → RESEARCH_SUPERVISOR
  const facultyResult = await prisma.$executeRaw`
    UPDATE "User"
    SET role = 'RESEARCH_SUPERVISOR', approved = true
    WHERE role::text = 'FACULTY'
  `;
  console.log(`[MIGRATE] FACULTY → RESEARCH_SUPERVISOR: ${facultyResult} rows updated`);

  // 2. PHD_SCHOLAR → RESEARCH_SCHOLAR
  const phdResult = await prisma.$executeRaw`
    UPDATE "User"
    SET role = 'RESEARCH_SCHOLAR'
    WHERE role::text = 'PHD_SCHOLAR'
  `;
  console.log(`[MIGRATE] PHD_SCHOLAR → RESEARCH_SCHOLAR: ${phdResult} rows updated`);

  // 3. ADMIN → INSTITUTION_ADMIN
  const adminResult = await prisma.$executeRaw`
    UPDATE "User"
    SET role = 'INSTITUTION_ADMIN', approved = true
    WHERE role::text = 'ADMIN'
  `;
  console.log(`[MIGRATE] ADMIN → INSTITUTION_ADMIN: ${adminResult} rows updated`);

  // 4. Ensure all RESEARCH_SUPERVISOR and INSTITUTION_ADMIN have approved = true
  const approvedSupervisors = await prisma.user.updateMany({
    where: {
      role: { in: ['RESEARCH_SUPERVISOR', 'INSTITUTION_ADMIN'] },
      approved: false,
    },
    data: { approved: true },
  });
  console.log(`[MIGRATE] Auto-approved supervisors/admins with approved=false: ${approvedSupervisors.count} rows`);

  // 5. Summary
  const counts = await prisma.user.groupBy({
    by: ['role'],
    _count: { role: true },
  });

  console.log('[MIGRATE] Current user role distribution:');
  counts.forEach(({ role, _count }) => {
    console.log(`  ${role}: ${_count.role} users`);
  });

  console.log('[MIGRATE] Migration complete.');
}

main()
  .catch((e) => {
    console.error('[MIGRATE] Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
