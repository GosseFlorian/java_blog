import type { Categorie } from "../api/categories.ts";

interface CategorieCardProps {
  categorie: Categorie;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

function CategorieCard({ categorie, onEdit, onDelete }: CategorieCardProps) {
  const { id, nom, description } = categorie;

  return (
    <article className="article-card categorie-card">
      <h2>{nom}</h2>
      <p className="article-contenu">{description}</p>
      <div className="article-actions">
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

export default CategorieCard;
