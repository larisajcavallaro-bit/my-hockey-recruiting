import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { GENDER_OPTIONS, AGE_BRACKETS } from "@/constants/schools";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  type: z.enum(["team", "school"]).default("team"),
  name: z.string().min(2),
  rinkName: z.string().optional(),
  address: z.string().min(5),
  city: z.string().min(2),
  zipCode: z.string().min(5),
  phone: z.string().optional(),
  website: z.string().url().or(z.literal("")),
  boysWebsite: z.union([z.string().url(), z.literal("")]).optional(),
  girlsWebsite: z.union([z.string().url(), z.literal("")]).optional(),
  description: z.string().min(10),
  imageUrl: z.string().optional(),
  gender: z.array(z.enum(GENDER_OPTIONS)).default([]),
  league: z.array(z.string()).default([]),
  boysLeague: z.array(z.string()).default([]),
  girlsLeague: z.array(z.string()).default([]),
  noGirlsProgram: z.boolean().optional(),
  ageBracketFrom: z.enum(AGE_BRACKETS).optional(),
  ageBracketTo: z.enum(AGE_BRACKETS).optional(),
});

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** GET - list schools (admin only) */
export async function GET(request: Request) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where =
      status && ["pending", "approved", "rejected", "removed"].includes(status)
        ? { status }
        : {};

    const schools = await prisma.schoolSubmission.findMany({
      where,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ schools });
  } catch (error) {
    console.error("Admin schools fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch schools" },
      { status: 500 }
    );
  }
}

/** POST - create school directly as approved (admin only) */
export async function POST(request: Request) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    const userId = session?.user?.id;
    if (role !== "ADMIN" || !userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = createSchema.parse(body);

    const invalidGender = data.gender.filter(
      (g) => !GENDER_OPTIONS.includes(g as (typeof GENDER_OPTIONS)[number])
    );
    if (invalidGender.length > 0) {
      return NextResponse.json(
        { error: `Invalid gender: ${invalidGender.join(", ")}` },
        { status: 400 }
      );
    }

    let base = toSlug(data.name);
    if (!base) base = "school";
    let slug = base;
    let n = 1;
    while (true) {
      const existing = await prisma.schoolSubmission.findFirst({
        where: { slug, status: "approved" },
      });
      if (!existing) break;
      slug = `${base}-${n}`;
      n++;
    }

    const sub = await prisma.schoolSubmission.create({
      data: {
        type: data.type ?? "team",
        name: data.name.trim(),
        rinkName: data.rinkName?.trim() || null,
        address: data.address.trim(),
        city: data.city.trim(),
        zipCode: data.zipCode.trim(),
        phone: data.phone?.trim() || null,
        website: data.website?.trim() || null,
        boysWebsite: data.boysWebsite?.trim() || null,
        girlsWebsite: data.girlsWebsite?.trim() || null,
        description: data.description.trim(),
        imageUrl: data.imageUrl?.trim() || null,
        gender: data.gender,
        league: Array.isArray(data.league) ? data.league.filter((l) => l?.trim()) : [],
        boysLeague: Array.isArray(data.boysLeague) ? data.boysLeague.filter((l) => l?.trim()) : [],
        girlsLeague: Array.isArray(data.girlsLeague) ? data.girlsLeague.filter((l) => l?.trim()) : [],
        noGirlsProgram: data.noGirlsProgram ?? false,
        ageBracketFrom: data.ageBracketFrom ?? null,
        ageBracketTo: data.ageBracketTo ?? null,
        status: "approved",
        slug,
        reviewedAt: new Date(),
        reviewedBy: userId,
      },
    });

    return NextResponse.json({ success: true, id: sub.id, slug: sub.slug }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg = error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    console.error("Admin create school error:", error);
    return NextResponse.json(
      { error: "Failed to create school" },
      { status: 500 }
    );
  }
}
