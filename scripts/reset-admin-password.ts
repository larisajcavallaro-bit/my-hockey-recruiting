/**
 * Reset an admin (or any user's) password when locked out.
 *
 * Add to .env.local, then run:
 *   ADMIN_EMAIL=larisajcavallaro@gmail.com
 *   NEW_ADMIN_PASSWORD=YourNewSecurePassword
 *
 * Run: dotenv -e .env.local -- npx tsx scripts/reset-admin-password.ts
 *
 * For PRODUCTION: Use .env.production or pass env vars so DATABASE_URL
 * points at your production database.
 */

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const newPassword = process.env.NEW_ADMIN_PASSWORD || "";

  if (!email) {
    console.error(`
Set ADMIN_EMAIL in .env.local, then run:

  dotenv -e .env.local -- npx tsx scripts/reset-admin-password.ts

Example - add to .env.local:
  ADMIN_EMAIL=larisajcavallaro@gmail.com
  NEW_ADMIN_PASSWORD=YourNewSecurePassword123!
`);
    process.exit(1);
  }

  if (!newPassword || newPassword.length < 8) {
    console.error(`
Set NEW_ADMIN_PASSWORD in .env.local (min 8 chars).

Example - add to .env.local:
  ADMIN_EMAIL=larisajcavallaro@gmail.com
  NEW_ADMIN_PASSWORD=YourNewSecurePassword123!
`);
    process.exit(1);
  }

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
  });

  if (!user) {
    console.error(`User not found: ${email}`);
    process.exit(1);
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  console.log(`✓ Password reset for ${email}. You can now sign in with your new password.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
