import type { Categorie } from "../api/articles";

interface CategoryTagsProps {
  categories?: Categorie[];
}

function CategoryTags({ categories }: CategoryTagsProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="category-tags">
      {categories.map((cat) => (
        <span key={cat.id} className="category-tag">
          {cat.nom}
        </span>
      ))}
    </div>
  );
}

export default CategoryTags;
