import { API_URL } from "./articles";
import { getToken } from "./auth";

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
 * POST /articles/{articleId}/commentaires — nécessite désormais d'être
 * connecté : l'API vérifie que le userId envoyé correspond au token JWT
 * fourni (403 sinon). Le header Authorization est donc obligatoire ici.
 */
export async function createComment(
  articleId: number,
  payload: CommentairePayload,
): Promise<Commentaire> {
  const token = getToken();

  if (!token) {
    throw new Error("Connecte-toi pour laisser un commentaire.");
  }

  const res = await fetch(`${API_URL}/articles/${articleId}/commentaires`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    throw new Error("Session expirée — reconnecte-toi.");
  }
  if (res.status === 403) {
    throw new Error("Le userId envoyé ne correspond pas à ta session.");
  }
  if (!res.ok) {
    throw new Error("Erreur lors de l'envoi du commentaire.");
  }

  return res.json();
}
