/**
 * Minimal auth config for middleware (Edge runtime).
 * No Prisma here - middleware only decodes JWT.
 */
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [],
  pages: {
    signIn: "/auth/sign-in",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = (user as { email?: string }).email;
        token.name = (user as { name?: string }).name;
        token.role = user.role;
        token.parentProfileId = (user as { parentProfileId?: string | null })
          .parentProfileId;
        token.coachProfileId = (user as { coachProfileId?: string | null })
          .coachProfileId;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { email?: string }).email = token.email as string;
        (session.user as { name?: string }).name = token.name as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { parentProfileId?: string | null }).parentProfileId =
          token.parentProfileId ?? null;
        (session.user as { coachProfileId?: string | null }).coachProfileId =
          token.coachProfileId ?? null;
      }
      return session;
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true,
} satisfies NextAuthConfig;
