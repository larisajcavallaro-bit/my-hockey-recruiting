// Example usage of ArticleCard with individual article data
// Import the articles data and Article type
import { defaultArticles, Article } from "@/data/articlesData";
import ArticleCard from "@/components/block/ArticleCard";

export default function ArticlesExample() {
  // You can use any article from the defaultArticles
  const articles: Article[] = [
    defaultArticles["team-building"],
    defaultArticles["speed-and-agility"],
    defaultArticles["nutrition-guide"],
  ];

  // Or create custom articles
  const customArticle: Article = {
    title: "Custom Article Title",
    category: "Custom Category",
    date: "January 20, 2026",
    author: "Custom Author",
    image: "/custom-image.jpg",
    excerpt: "This is a custom article excerpt...",
    content: `This is the full custom article content. 
    
You can include multiple paragraphs separated by double line breaks.`,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article) => (
        <ArticleCard
          key={article.title}
          title={article.title}
          category={article.category}
          date={article.date}
          author={article.author}
          image={article.image}
          excerpt={article.excerpt}
          content={article.content}
        />
      ))}

      {/* Custom article */}
      <ArticleCard
        title={customArticle.title}
        category={customArticle.category}
        date={customArticle.date}
        author={customArticle.author}
        image={customArticle.image}
        excerpt={customArticle.excerpt}
        content={customArticle.content}
      />
    </div>
  );
}
