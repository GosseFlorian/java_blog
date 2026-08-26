import { Link } from "react-router-dom";
import type { Article } from "../api/articles";

interface ArticleCardProps {
  article: Article;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function excerpt(text: string, length = 180): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trimEnd()}…`;
}

function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="article-card">
      <h2>
        <Link to={`/articles/${article.id}`}>{article.titre}</Link>
      </h2>
      <p className="article-date">{formatDate(article.date)}</p>
      <p className="article-excerpt">{excerpt(article.contenu)}</p>
      <Link to={`/articles/${article.id}`} className="article-link">
        Lire la suite →
      </Link>
    </article>
  );
}

export default ArticleCard;
