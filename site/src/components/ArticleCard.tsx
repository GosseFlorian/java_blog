import { Link } from "react-router-dom";
import type { Article } from "../api/articles";
import { excerpt, formatArticleDate } from "../utils/formatUtils";
import CategoryTags from "./CategoryTags";

interface ArticleCardProps {
  article: Article;
}

function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="article-card">
      <h2>{article.titre}</h2>
      <CategoryTags categories={article.categories} />
      <blockquote className="article-excerpt">
        <p>{excerpt(article.contenu)}</p>
      </blockquote>
      <p className="article-date">
        Posté le {formatArticleDate(article.date)}{" "}
        <Link to={`/articles/${article.id}`} className="article-link">
          lire la suite ➧
        </Link>
      </p>
    </article>
  );
}

export default ArticleCard;
