export const API_URL = "http://localhost:8080";

/**
 * Correspond au DTO ArticleResponse renvoyé par l'API
 * (fr.ada.java_blog.dto.ArticleResponse : id, titre, contenu, publie, date).
 */
export interface Article {
  id: number;
  titre: string;
  contenu: string;
  publie: boolean;
  date: string;
}

export async function fetchArticles(): Promise<Article[]> {
  const res = await fetch(`${API_URL}/articles`);
  if (!res.ok) throw new Error("Erreur chargement articles");
  return res.json();
}

export async function fetchArticle(id: number): Promise<Article | null> {
  const res = await fetch(`${API_URL}/articles/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Erreur article");
  return res.json();
}
