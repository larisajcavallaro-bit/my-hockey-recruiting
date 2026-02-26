import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        oneTimeToken: { label: "One-time token", type: "text" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email) return null;

        const email = String(credentials.email).trim().toLowerCase();
        try {
          const blocked = await prisma.blockedEmail.findUnique({
            where: { email },
          });
          if (blocked) return null;
        } catch {
          // blocked_emails table may not exist yet; continue
        }

        const user = await prisma.user.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
          include: {
            parentProfile: true,
            coachProfile: true,
          },
        });

        if (!user) return null;

        // One-time token flow (after phone verification)
        const token = credentials.oneTimeToken as string | undefined;
        if (token) {
          if (
            !user.oneTimeSignInToken ||
            !user.oneTimeSignInTokenExpiresAt ||
            user.oneTimeSignInToken !== token ||
            new Date() > user.oneTimeSignInTokenExpiresAt
          ) {
            return null;
          }
          // Clear token after use
          await prisma.user.update({
            where: { id: user.id },
            data: {
              oneTimeSignInToken: null,
              oneTimeSignInTokenExpiresAt: null,
            },
          });
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
            parentProfileId: user.parentProfile?.id ?? null,
            coachProfileId: user.coachProfile?.id ?? null,
          };
        }

        // Normal password flow
        if (!credentials.password || !user.passwordHash) return null;

        // ADMIN and COACH can sign in without email verification; parents need phone verification
        if (!user.emailVerified && user.role !== "ADMIN" && user.role !== "COACH") {
          throw new Error("Please verify your phone first. Check your text messages for the verification code.");
        }

        const valid = await verifyPassword(
          String(credentials.password),
          user.passwordHash
        );
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          parentProfileId: user.parentProfile?.id ?? null,
          coachProfileId: user.coachProfile?.id ?? null,
        };
      },
    }),
  ],
});
