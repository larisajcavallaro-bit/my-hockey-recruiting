import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  name: z.string().min(2, "Rink name required"),
  address: z.string().min(5, "Address required"),
  city: z.string().min(2, "City required"),
  zipCode: z.string().min(5, "Zip code required"),
});

/** GET - list rinks for dropdown (admin only) */
export async function GET() {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const rinks = await prisma.rink.findMany({
      orderBy: [{ name: "asc" }, { city: "asc" }],
    });
    return NextResponse.json({ rinks });
  } catch (error) {
    console.error("Admin rinks fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch rinks" }, { status: 500 });
  }
}

/** POST - add a new rink (admin only) */
export async function POST(request: Request) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = createSchema.parse(body);

    const rink = await prisma.rink.create({
      data: {
        name: data.name.trim(),
        address: data.address.trim(),
        city: data.city.trim(),
        zipCode: data.zipCode.trim(),
      },
    });
    return NextResponse.json(rink, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.flatten() },
        { status: 400 }
      );
    }
    console.error("Admin rink create error:", error);
    return NextResponse.json({ error: "Failed to create rink" }, { status: 500 });
  }
}
