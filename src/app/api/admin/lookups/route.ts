import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const VALID_CATEGORIES = [
  "coach_title",
  "birth_year",
  "coach_specialty",
  "area",
  "league",
  "level",
  "team",
  "position",
  "gender",
  "event_type",
  "venue",
] as const;

const createSchema = z.object({
  category: z.enum(VALID_CATEGORIES),
  value: z.string().min(1, "Value is required"),
  sortOrder: z.number().int().optional(),
});

export async function GET(request: Request) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as (typeof VALID_CATEGORIES)[number] | null;

    const where = category && VALID_CATEGORIES.includes(category) ? { category } : {};
    const lookups = await prisma.lookupValue.findMany({
      where,
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { value: "asc" }],
    });

    return NextResponse.json({ lookups });
  } catch (error) {
    console.error("Admin lookups fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch lookups" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = createSchema.parse(body);

    const lookup = await prisma.lookupValue.create({
      data: {
        category: data.category,
        value: data.value.trim(),
        sortOrder: data.sortOrder ?? 0,
      },
    });

    return NextResponse.json({ lookup }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.flatten() },
        { status: 400 },
      );
    }
    console.error("Admin lookup create error:", error);
    return NextResponse.json({ error: "Failed to create lookup" }, { status: 500 });
  }
}
