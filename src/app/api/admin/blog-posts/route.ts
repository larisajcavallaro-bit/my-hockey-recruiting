import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { BLOG_CATEGORIES } from "@/constants/blog";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  title: z.string().min(2, "Title required"),
  content: z.string().min(1, "Content required"),
  imageUrl: z.string().optional(),
  author: z.string().min(1, "Author required"),
  category: z.string().refine((c) => BLOG_CATEGORIES.includes(c as (typeof BLOG_CATEGORIES)[number]), "Invalid category"),
  featured: z.boolean().optional(),
  publishedAt: z.string().min(1, "Date required"), // YYYY-MM-DD or full ISO
});

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return null;
}

/** GET - list blog posts (admin only) */
export async function GET() {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
    });
    return NextResponse.json({ posts });
  } catch (err) {
    console.error("Admin list blog posts:", err);
    return NextResponse.json({ error: "Failed to load posts" }, { status: 500 });
  }
}

/** POST - create blog post (admin only) */
export async function POST(request: Request) {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;
  try {
    const body = await request.json();
    const data = createSchema.parse(body);
    const publishedAt =
      typeof data.publishedAt === "string" && data.publishedAt.includes("T")
        ? new Date(data.publishedAt)
        : new Date(data.publishedAt + "T12:00:00Z");
    const featured = !!data.featured;
    const post = await prisma.$transaction(async (tx) => {
      if (featured) {
        await tx.blogPost.updateMany({ data: { featured: false } });
      }
      return tx.blogPost.create({
        data: {
          title: data.title.trim(),
          content: data.content.trim(),
          imageUrl: data.imageUrl?.trim() || null,
          author: data.author.trim(),
          category: data.category,
          featured,
          publishedAt,
        },
      });
    });
    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg = error.issues[0]?.message ?? "Invalid input";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    console.error("Admin create blog post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
