const API = "http://localhost:8080";

export interface Article {
  id: number;
  titre: string;
  contenu: string;
  statut: boolean;
  date: string;
}

export async function fetchArticles(): Promise<Article[]> {
  const res = await fetch(`${API}/articles`);
  if (!res.ok) throw new Error("Erreur chargement articles");
  return res.json();
}

export async function fetchArticle(id: number): Promise<Article | null> {
  const res = await fetch(`${API}/articles/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Erreur article");
  return res.json();
}
