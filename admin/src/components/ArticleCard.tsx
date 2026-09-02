import type { Article } from "../types/article.ts";
import {
  excerpt,
  formatArticleDate,
} from "../utils/formatUtils.ts";
import CategoryTags from "./CategoryTags.tsx";

interface ArticleCardProps {
  article: Article;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

function ArticleCard({ article, onEdit, onDelete, onView }: ArticleCardProps) {
  const { id, titre, contenu, publie, date, categories } = article;
  const statutLabel = publie ? "Publié" : "Brouillon";

  return (
    <article className="article-card">
      <h2>{titre}</h2>
      <CategoryTags categories={categories} />
      <blockquote className="article-excerpt">
        <p>{excerpt(contenu)}</p>
      </blockquote>
      <p className="article-date">
        Posté le {formatArticleDate(date)}{" "}
        <span className="article-statut">— {statutLabel}</span>
      </p>
      <div className="article-actions">
        <button type="button" onClick={() => onView(id)}>
          Voir l'article
        </button>
        <button type="button" onClick={() => onEdit(id)}>
          Modifier
        </button>
        <button type="button" onClick={() => onDelete(id)}>
          Supprimer
        </button>
      </div>
    </article>
  );
}

export default ArticleCard;
