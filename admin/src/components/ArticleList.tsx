import ArticleCard from "./ArticleCard.tsx";
import type { Article } from "../data/articleSample.ts";

/**
 * ArticleList — liste de cartes articles.
 * Props :
 *   - articles : tableau d'objets article
 *   - onEdit, onDelete : callbacks transmis à chaque ArticleCard
 */
interface ArticleListProps {
  articles: Article[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

function ArticleList({ articles, onEdit, onDelete }: ArticleListProps) {
  // Cas limite : tableau vide — message clair pour l'utilisateur
  if (articles.length === 0) {
    return <p className="empty-list">Aucun article à afficher.</p>;
  }

  return (
    <section className="article-list">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}

export default ArticleList;
