/**
 * Change passwords for demo/admin accounts.
 * Add to .env.local (then remove after running):
 *   NEW_DEMO_PASSWORD=YourNewSecurePassword
 *
 * Run: dotenv -e .env.local -- npx tsx scripts/change-demo-passwords.ts
 */

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

const DEMO_EMAILS = [
  "admin@example.com",
  "coach@example.com",
  "parent@example.com",
  "gold-test@example.com",
  "elite-test@example.com",
];

async function main() {
  const newPassword = process.env.NEW_DEMO_PASSWORD;
  if (!newPassword || newPassword.length < 8) {
    console.error(`
Set NEW_DEMO_PASSWORD in .env.local (min 8 chars), then run:

  npm run change-demo-passwords

Example - add to .env.local:
  NEW_DEMO_PASSWORD=MySecurePass123!

Then run the script. Remove NEW_DEMO_PASSWORD from .env.local after.
`);
    process.exit(1);
  }

  const passwordHash = await hashPassword(newPassword);

  for (const email of DEMO_EMAILS) {
    const result = await prisma.user.updateMany({
      where: { email },
      data: { passwordHash },
    });
    if (result.count > 0) {
      console.log(`  ✓ Updated ${email}`);
    } else {
      console.log(`  - ${email} (not found)`);
    }
  }

  console.log("\nDone. Demo accounts now use your new password.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
