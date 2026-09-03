export function formatArticleDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function excerpt(text: string, length = 180): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length).trimEnd()}…`;
}

export function formatCategoryList(categories: { nom: string }[] | undefined): string | null {
  if (!categories || categories.length === 0) return null;
  return categories.map((c) => c.nom).join(', ');
}
