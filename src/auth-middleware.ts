/**
 * Auth for middleware only. No Prisma - safe for Edge runtime.
 */
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { auth } = NextAuth(authConfig);
