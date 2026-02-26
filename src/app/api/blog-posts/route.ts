import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET - public list of blog posts (featured first, then by date) */
export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    });
    return NextResponse.json({ posts });
  } catch (err) {
    console.error("Public list blog posts:", err);
    return NextResponse.json({ error: "Failed to load posts" }, { status: 500 });
  }
}
