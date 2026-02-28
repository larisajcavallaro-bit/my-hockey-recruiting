/**
 * Remove demo/seed team entries that were created for testing.
 * Run: npm run remove-seed-teams
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SEED_IDS = ["seed-school-1", "seed-school-2", "seed-school-3", "seed-school-4"];

async function main() {
  const result = await prisma.schoolSubmission.deleteMany({
    where: { id: { in: SEED_IDS } },
  });
  console.log(`Removed ${result.count} seed demo entries.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
