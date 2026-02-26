import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

const updateSchema = z.object({
  value: z.string().min(1).optional(),
  sortOrder: z.number().int().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
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

    const lookup = await prisma.lookupValue.update({
      where: { id },
      data: {
        ...(data.value !== undefined && { value: data.value.trim() }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      },
    });

    return NextResponse.json({ lookup });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.flatten() },
        { status: 400 },
      );
    }
    console.error("Admin lookup update error:", error);
    return NextResponse.json({ error: "Failed to update lookup" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const role = (session?.user as { role?: string })?.role;
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.lookupValue.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin lookup delete error:", error);
    return NextResponse.json({ error: "Failed to delete lookup" }, { status: 500 });
  }
}
