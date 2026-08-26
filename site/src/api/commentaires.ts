import { API_URL } from "./articles";

/**
 * Correspond au DTO CommentaireResponse renvoyé par l'API
 * (fr.ada.java_blog.dto.CommentaireResponse : id, contenu, userId, date).
 */
export interface Commentaire {
  id: number;
  contenu: string;
  userId: number;
  date: string;
}

export interface CommentairePayload {
  contenu: string;
  userId: number;
}

/**
 * GET /articles/{articleId}/commentaires — public, pas d'auth requise.
 */
export async function fetchComments(articleId: number): Promise<Commentaire[]> {
  const res = await fetch(`${API_URL}/articles/${articleId}/commentaires`);
  if (!res.ok) {
    throw new Error("Erreur lors du chargement des commentaires.");
  }
  return res.json();
}

/**
 * POST /articles/{articleId}/commentaires — public, pas d'auth requise.
 *
 * ⚠️ L'API n'expose aucune route publique d'inscription/connexion visiteur :
 * le payload attend un userId existant (voir doc/blog.sql, users 1 à 10).
 * En attendant un vrai mécanisme d'authentification visiteur, c'est
 * CommentForm qui demande cet identifiant directement dans le formulaire.
 */
export async function createComment(
  articleId: number,
  payload: CommentairePayload,
): Promise<Commentaire> {
  const res = await fetch(`${API_URL}/articles/${articleId}/commentaires`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Erreur lors de l'envoi du commentaire.");
  }

  return res.json();
}
