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
    <section className="article-list" aria-label="Articles récents">
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            <ArticleCard article={article} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ArticleList;
