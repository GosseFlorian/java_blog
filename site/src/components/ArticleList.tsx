import ArticleCard from "./ArticleCard";
import type { Article } from "../api/articles";

interface ArticleListProps {
  articles: Article[];
}

function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return <p className="empty-list">Aucun article publié pour le moment.</p>;
  }

  return (
    <div className="article-list">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

export default ArticleList;
