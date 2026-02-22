import ArticleCard from "@/components/block/ArticleCard";
import BlockBanner from "@/components/block/BlockBanner";
import CategoryNavBar from "@/components/block/CategoryNavBar";
import FeaturedArticle from "@/components/block/FeaturedArticle";
import NewsletterCTA from "@/components/block/NewsletterCTA";

const articles = [
  {
    category: "Coaching Tips",
    title: "Essential Team Building Strategies",
    date: "Jan 10, 2026",
    image: "/newasset/blog/Essential Team Building.png",
    excerpt: "Learn how to foster teamwork and communication...",
    author: "Coach John",
    content:
      "Team building is essential for success in hockey. Effective communication and trust are the foundations of a winning team.",
  },
  {
    category: "Tournament News",
    title: "Youth Hockey Tournament Season",
    date: "Jan 8, 2026",
    image: "/newasset/blog/Youth Hockey Tournament.png",
    excerpt: "A comprehensive guide for hockey parents...",
    author: "Coach Sarah",
    content:
      "Tournament season is here! Here are tips for parents to help their young athletes succeed.",
  },
  {
    category: "Player Development",
    title: "Goaltending Basics for Young Players",
    date: "Jan 3, 2026",
    image: "/newasset/blog/Goaltending Basics for Young Players.png",
    excerpt: "An introduction to goalie-specific training...",
    author: "Coach Mike",
    content:
      "Goaltending requires specialized training and technique. Let's explore the fundamentals.",
  },
];

export default function HockeyBlog() {
  return (
    <main className="bg-gray-50 min-h-screen pb-20">
      <BlockBanner />
      <CategoryNavBar />
      <FeaturedArticle />

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((art, i) => (
          <ArticleCard key={i} {...art} />
        ))}
      </div>

      <NewsletterCTA />
    </main>
  );
}
