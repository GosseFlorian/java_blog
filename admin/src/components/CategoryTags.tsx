import type { ArticleCategory } from "../data/articleSample.ts";

interface CategoryTagsProps {
  categories?: ArticleCategory[];
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
