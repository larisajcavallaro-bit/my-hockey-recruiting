import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// League, Level, Team are hierarchical - use /api/leagues, /api/levels, /api/teams
const VALID_CATEGORIES = [
  "coach_title",
  "birth_year",
  "coach_specialty",
  "player_evaluation",
  "area",
  "position",
  "gender",
  "event_type",
  "venue",
] as const;

const DEFAULTS: Record<(typeof VALID_CATEGORIES)[number], string[]> = {
  coach_title: ["Head Coach", "Assistant Coach"],
  birth_year: Array.from({ length: 20 }, (_, i) => String(2016 - i)), // 2016 down to 1997
  area: [],
  coach_specialty: [
    "Skill Development",
    "Communication",
    "Player Development",
    "Tactical Strategy",
    "Leadership",
    "Game Strategy",
    "Skating",
    "Shooting",
    "Puck Handling",
    "Defensive Play",
    "Offensive Play",
    "Goaltending",
  ],
  player_evaluation: [
    "Skating",
    "Shooting",
    "Passing",
    "Game Sense",
    "Work Ethic",
  ],
  position: ["Forward", "Defense", "Goalie"],
  gender: ["Male", "Female"],
  event_type: ["Camp", "Tournament", "ID Skate", "Tryouts", "Clinic"],
  venue: [],
} as const;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as (typeof VALID_CATEGORIES)[number] | null;

    if (!category || !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: "Invalid category. Use: coach_title, birth_year, coach_specialty, area, player_evaluation, position, gender, event_type, or venue" },
        { status: 400 },
      );
    }

    const lookups = await prisma.lookupValue.findMany({
      where: { category },
      orderBy: [{ sortOrder: "asc" }, { value: "asc" }],
    });

    const values = lookups.length > 0 ? lookups.map((l) => l.value) : DEFAULTS[category];

    return NextResponse.json(
      { lookups: values },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Lookups fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch lookups" }, { status: 500 });
  }
}
