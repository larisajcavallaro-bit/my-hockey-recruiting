import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET - list levels (flat list, optional ?q= for typeahead search) */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.toLowerCase().trim();
    const take = Math.min(200, parseInt(searchParams.get("limit") || "100", 10) || 100);

    const where = q
      ? { category: "level" as const, value: { contains: q, mode: "insensitive" as const } }
      : { category: "level" as const };

    const lookups = await prisma.lookupValue.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { value: "asc" }],
      take,
    });

    const levels = lookups.map((l) => ({ id: l.id, name: l.value }));
    return NextResponse.json(
      { levels },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    console.error("Levels fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch levels" }, { status: 500 });
  }
}
