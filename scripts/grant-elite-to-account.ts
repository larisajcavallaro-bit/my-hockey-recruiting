/**
 * Grant elite plan to a parent account (no subscription required).
 * Run: dotenv -e .env.local -- npx tsx scripts/grant-elite-to-account.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const EMAIL = "larisajcavallaro@gmail.com";

async function main() {
  const email = EMAIL.trim().toLowerCase();
  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    include: { parentProfile: true },
  });

  if (!user) {
    console.error(`User not found: ${email}`);
    process.exit(1);
  }

  if (user.parentProfile) {
    await prisma.parentProfile.update({
      where: { id: user.parentProfile.id },
      data: {
        planId: "elite",
        subscriptionStatus: "active",
        // Leave stripe fields null - no real subscription
      },
    });
    console.log(`✓ Updated ${email} → Elite plan (no subscription)`);
  } else {
    // Create ParentProfile for admin/user who doesn't have one
    await prisma.parentProfile.create({
      data: {
        userId: user.id,
        planId: "elite",
        subscriptionStatus: "active",
      },
    });
    console.log(`✓ Created ParentProfile for ${email} → Elite plan (no subscription)`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
