import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ensureE164 } from "@/lib/verify";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const role = (session.user as { role?: string })?.role;
    let parentProfileId = (session.user as { parentProfileId?: string | null })?.parentProfileId;

    if (role === "PARENT" && !parentProfileId) {
      const profile = await prisma.parentProfile.findUnique({
        where: { userId },
      });
      parentProfileId = profile?.id ?? null;
    }

    if (role !== "PARENT" || !parentProfileId) {
      return NextResponse.json({ error: "Parent profile not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { parentProfile: true },
    });

    if (!user || !user.parentProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: user.name ?? "",
      email: user.email,
      image: user.image ?? null,
      phone: user.parentProfile.phone ?? "",
      location: user.parentProfile.location ?? "",
      bio: user.parentProfile.bio ?? "",
      socialLink: user.parentProfile.socialLink ?? "",
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

const updateSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  socialLink: z.union([z.string().url(), z.literal("")]).optional(),
});

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const role = (session.user as { role?: string })?.role;
    let parentProfileId = (session.user as { parentProfileId?: string | null })?.parentProfileId;

    // Fallback: look up ParentProfile if session lacks it (e.g. stale JWT)
    if (role === "PARENT" && !parentProfileId) {
      const profile = await prisma.parentProfile.findUnique({
        where: { userId },
      });
      parentProfileId = profile?.id ?? null;
    }

    if (role !== "PARENT" || !parentProfileId) {
      return NextResponse.json(
        { error: "Parent profile not found. Please sign out and sign back in." },
        { status: 404 },
      );
    }

    const body = await request.json();
    const raw = updateSchema.parse(body);

    // Normalize: treat empty strings as "don't update"
    const data = {
      name: raw.name?.trim() || undefined,
      email: raw.email?.trim() ? raw.email.trim().toLowerCase() : undefined,
      phone: raw.phone !== undefined ? raw.phone : undefined,
      location: raw.location !== undefined ? raw.location : undefined,
      bio: raw.bio !== undefined ? raw.bio : undefined,
      socialLink: raw.socialLink !== undefined ? (raw.socialLink?.trim() || null) : undefined,
    };

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (data.name !== undefined || data.email !== undefined) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          ...(data.name !== undefined && { name: data.name || null }),
          ...(data.email !== undefined && { email: data.email }),
        },
      });
    }

    if (data.phone !== undefined || data.location !== undefined || data.bio !== undefined || data.socialLink !== undefined) {
      const phoneValue =
        data.phone !== undefined
          ? (data.phone as string).trim()
            ? ensureE164(data.phone as string)
            : null
          : undefined;
      await prisma.parentProfile.update({
        where: { id: parentProfileId },
        data: {
          ...(data.phone !== undefined && { phone: phoneValue ?? null }),
          ...(data.location !== undefined && { location: data.location || null }),
          ...(data.bio !== undefined && { bio: data.bio || null }),
          ...(data.socialLink !== undefined && { socialLink: data.socialLink || null }),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.flatten() },
        { status: 400 },
      );
    }
    if (error && typeof error === "object" && "code" in error) {
      const prismaError = error as { code?: string; meta?: unknown };
      if (prismaError.code === "P2002") {
        return NextResponse.json(
          { error: "This email is already in use by another account" },
          { status: 409 },
        );
      }
    }
    console.error("Profile update error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update profile",
      },
      { status: 500 },
    );
  }
}
