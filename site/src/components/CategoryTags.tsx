import type { Categorie } from "../api/articles";

interface CategoryTagsProps {
  categories?: Categorie[];
}

function CategoryTags({ categories }: CategoryTagsProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <ul className="category-tags">
      {categories.map((cat) => (
        <li key={cat.id} className="category-tag">
          {cat.nom}
        </li>
      ))}
    </ul>
  );
}

export default CategoryTags;
