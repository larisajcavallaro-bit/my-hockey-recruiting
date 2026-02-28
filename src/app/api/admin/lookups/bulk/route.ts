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

const rowSchema = z.object({
  category: z.enum(VALID_CATEGORIES),
  value: z.string().min(1).transform((s) => s.trim()),
  sortOrder: z.coerce.number().int().optional().default(0),
});

/** POST - bulk import lookups (admin only) */
export async function POST(request: Request) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const rows = Array.isArray(body) ? body : body.rows ?? [];
    const format = body.format as string | undefined; // "league_level_team" for CSV with League,Level,Team columns

    const results = { created: 0, skipped: 0, errors: [] as string[] };
    let sortOrder = 0;

    if (format === "league_level_team") {
      for (let i = 0; i < rows.length; i++) {
        const raw = rows[i];
        const keys = Object.keys(raw || {}).map((k) => k.toLowerCase());
        const leagueKey = keys.find((k) => k === "league");
        const levelKey = keys.find((k) => k === "level");
        const teamKey = keys.find((k) => k === "team");
        const get = (k: string | undefined) => (k ? String((raw as Record<string, unknown>)[Object.keys(raw || {}).find(key => key.toLowerCase() === k) ?? ""] ?? "").trim() : "");
        const r = { league: get(leagueKey ?? "league"), level: get(levelKey ?? "level"), team: get(teamKey ?? "team") };
        if (!r.league && !r.level && !r.team) continue;
        for (const [cat, val] of [["league", r.league], ["level", r.level], ["team", r.team]] as const) {
          if (!val) continue;
          try {
            await prisma.lookupValue.upsert({
              where: { category_value: { category: cat, value: val } },
              create: { category: cat, value: val, sortOrder: sortOrder++ },
              update: {},
            });
            results.created++;
          } catch (e) {
            results.errors.push(`Row ${i + 1} (${cat}:${val}): ${String(e)}`);
          }
        }
      }
    } else {
      for (let i = 0; i < rows.length; i++) {
        const parsed = rowSchema.safeParse(rows[i]);
        if (!parsed.success) {
          results.errors.push(`Row ${i + 1}: ${parsed.error.message}`);
          continue;
        }
        const { category, value, sortOrder: so } = parsed.data;
        try {
          await prisma.lookupValue.upsert({
            where: { category_value: { category, value } },
            create: { category, value, sortOrder: so ?? 0 },
            update: { sortOrder: so ?? 0 },
          });
          results.created++;
        } catch (e) {
          results.errors.push(`Row ${i + 1} (${value}): ${String(e)}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      created: results.created,
      skipped: results.skipped,
      errors: results.errors,
      total: rows.length,
    });
  } catch (error) {
    console.error("Admin lookups bulk import error:", error);
    return NextResponse.json(
      { error: "Failed to import lookups" },
      { status: 500 }
    );
  }
}
