import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { GENDER_OPTIONS, AGE_BRACKETS } from "@/constants/schools";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  address: z.string().min(5).optional(),
  city: z.string().min(2).optional(),
  zipCode: z.string().min(5).optional(),
  phone: z.string().nullable().optional(),
  website: z.union([z.string().url(), z.literal("")]).nullable().optional(),
  description: z.string().min(10).optional(),
  imageUrl: z.string().nullable().optional(),
  gender: z.array(z.enum(GENDER_OPTIONS)).optional(),
  league: z.array(z.string()).optional(),
  ageBracketFrom: z.enum(AGE_BRACKETS).nullable().optional(),
  ageBracketTo: z.enum(AGE_BRACKETS).nullable().optional(),
});

/** GET - single school (admin only) */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const school = await prisma.schoolSubmission.findUnique({
      where: { id },
    });
    if (!school) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(school);
  } catch (error) {
    console.error("Admin school fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch school" },
      { status: 500 }
    );
  }
}

/** PATCH - update school (admin only) */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = updateSchema.parse(body);

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.address !== undefined) updateData.address = data.address.trim();
    if (data.city !== undefined) updateData.city = data.city.trim();
    if (data.zipCode !== undefined) updateData.zipCode = data.zipCode.trim();
    if (data.phone !== undefined) updateData.phone = data.phone?.trim() || null;
    if (data.website !== undefined) updateData.website = data.website === "" || data.website === null ? null : data.website.trim();
    if (data.description !== undefined) updateData.description = data.description.trim();
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl?.trim() || null;
    if (data.gender !== undefined) updateData.gender = data.gender;
    if (data.league !== undefined) updateData.league = Array.isArray(data.league) ? data.league.filter((l) => l?.trim()) : [];
    if (data.ageBracketFrom !== undefined) updateData.ageBracketFrom = data.ageBracketFrom;
    if (data.ageBracketTo !== undefined) updateData.ageBracketTo = data.ageBracketTo;

    await prisma.schoolSubmission.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg = error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    console.error("Admin school update error:", error);
    return NextResponse.json(
      { error: "Failed to update school" },
      { status: 500 }
    );
  }
}

/** DELETE - remove school (admin only) */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.schoolSubmission.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin school delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete school" },
      { status: 500 }
    );
  }
}
