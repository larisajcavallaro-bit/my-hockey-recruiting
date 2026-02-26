import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// DELETE /api/blocks/[id] - unblock a user
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const block = await prisma.block.findFirst({
      where: {
        id,
        blockerUserId: session.user.id,
      },
    });

    if (!block) {
      return NextResponse.json({ error: "Block not found" }, { status: 404 });
    }

    await prisma.block.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[blocks] DELETE", err);
    return NextResponse.json(
      { error: "Failed to unblock" },
      { status: 500 }
    );
  }
}
