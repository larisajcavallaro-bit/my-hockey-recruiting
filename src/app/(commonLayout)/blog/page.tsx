import BlockBanner from "@/components/block/BlockBanner";
import CategoryNavBar from "@/components/block/CategoryNavBar";
import FeaturedArticle from "@/components/block/FeaturedArticle";
import NewsletterCTA from "@/components/block/NewsletterCTA";
import BlogPostGrid from "@/components/block/BlogPostGrid";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getBlogPosts() {
  try {
    const raw = await prisma.blogPost.findMany({
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    });
    const serialize = (p: (typeof raw)[number]) => ({
      ...p,
      publishedAt: p.publishedAt.toISOString(),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    });
    const posts = raw.map(serialize);
    const featured = posts.find((p) => p.featured) ?? null;
    const rest = posts.filter((p) => !p.featured);
    return { posts: rest, featured };
  } catch {
    return { posts: [], featured: null };
  }
}

export default async function HockeyBlog() {
  const { posts, featured } = await getBlogPosts();

  return (
    <main className="bg-gray-50 min-h-screen pb-20">
      <div className="w-full bg-amber-500 text-slate-900 py-3 px-4 text-center font-semibold text-lg shadow-md">
        Coming Soon — Blog posts are on the way. Check back soon!
      </div>
      <BlockBanner />
      <CategoryNavBar />
      <FeaturedArticle post={featured} />
      <BlogPostGrid posts={posts} />

      <NewsletterCTA />
    </main>
  );
}
