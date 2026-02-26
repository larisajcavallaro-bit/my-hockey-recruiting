import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return null;
}

/** PATCH - update league */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;
  try {
    const { id } = await params;
    const body = await request.json();
    const data = z.object({ name: z.string().min(1).optional(), sortOrder: z.number().int().optional() }).parse(body);
    const updateData: { value?: string; sortOrder?: number } = {};
    if (data.name != null) updateData.value = data.name.trim();
    if (data.sortOrder != null) updateData.sortOrder = data.sortOrder;
    const lookup = await prisma.lookupValue.update({
      where: { id },
      data: updateData,
    });
    return NextResponse.json({ league: { id: lookup.id, name: lookup.value } });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: e.issues[0]?.message }, { status: 400 });
    console.error("Admin update league:", e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

/** DELETE - delete league (cascades to levels and teams) */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;
  try {
    const { id } = await params;
    await prisma.lookupValue.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Admin delete league:", e);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
