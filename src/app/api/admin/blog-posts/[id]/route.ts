import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { BLOG_CATEGORIES } from "@/constants/blog";

export const dynamic = "force-dynamic";

const updateSchema = z.object({
  title: z.string().min(2).optional(),
  content: z.string().min(1).optional(),
  imageUrl: z.string().nullable().optional(),
  author: z.string().min(1).optional(),
  category: z.string().refine((c) => BLOG_CATEGORIES.includes(c as (typeof BLOG_CATEGORIES)[number])).optional(),
  featured: z.boolean().optional(),
  publishedAt: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)).optional(),
});

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return null;
}

/** PUT - update blog post (admin only) */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;
  try {
    const { id } = await params;
    const body = await request.json();
    const raw = updateSchema.parse(body);

    const data: Record<string, unknown> = {};
    if (raw.title != null) data.title = raw.title.trim();
    if (raw.content != null) data.content = raw.content.trim();
    if (raw.imageUrl !== undefined) data.imageUrl = raw.imageUrl === "" ? null : raw.imageUrl;
    if (raw.author != null) data.author = raw.author.trim();
    if (raw.category != null) data.category = raw.category;
    if (raw.featured !== undefined) data.featured = raw.featured;
    if (raw.publishedAt != null) {
      data.publishedAt =
        raw.publishedAt.includes("T")
          ? new Date(raw.publishedAt)
          : new Date(raw.publishedAt + "T12:00:00Z");
    }

    const post = await prisma.$transaction(async (tx) => {
      if (raw.featured === true) {
        await tx.blogPost.updateMany({ where: { id: { not: id } }, data: { featured: false } });
      }
      return tx.blogPost.update({ where: { id }, data });
    });
    return NextResponse.json({ success: true, post });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg = error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    console.error("Admin update blog post:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

/** DELETE - delete blog post (admin only) */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;
  try {
    const { id } = await params;
    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete blog post:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
