import { API_URL } from "./articles";
import { getToken } from "./auth";

export interface Commentaire {
  id: number;
  contenu: string;
  userId: number;
  pseudo: string | null;
  date: string;
}

export interface CommentairePayload {
  contenu: string;
  userId: number;
}

function authJsonHeaders(): Record<string, string> {
  const token = getToken();
  if (!token) {
    return { "Content-Type": "application/json" };
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchComments(articleId: number): Promise<Commentaire[]> {
  const res = await fetch(`${API_URL}/articles/${articleId}/commentaires`);
  if (!res.ok) {
    throw new Error("Erreur lors du chargement des commentaires.");
  }
  return res.json();
}

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
    headers: authJsonHeaders(),
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

export async function updateComment(
  id: number,
  contenu: string,
): Promise<Commentaire> {
  const token = getToken();

  if (!token) {
    throw new Error("Connecte-toi pour modifier ton commentaire.");
  }

  const res = await fetch(`${API_URL}/commentaires/${id}`, {
    method: "PATCH",
    headers: authJsonHeaders(),
    body: JSON.stringify({ contenu }),
  });

  if (res.status === 401) {
    throw new Error("Session expirée — reconnecte-toi.");
  }
  if (res.status === 403) {
    throw new Error("Tu ne peux modifier que tes propres commentaires.");
  }
  if (!res.ok) {
    throw new Error("Erreur lors de la modification du commentaire.");
  }

  return res.json();
}

export async function deleteComment(id: number): Promise<void> {
  const token = getToken();

  if (!token) {
    throw new Error("Connecte-toi pour supprimer ton commentaire.");
  }

  const res = await fetch(`${API_URL}/commentaires/${id}`, {
    method: "DELETE",
    headers: authJsonHeaders(),
  });

  if (res.status === 401) {
    throw new Error("Session expirée — reconnecte-toi.");
  }
  if (res.status === 403) {
    throw new Error("Tu ne peux supprimer que tes propres commentaires.");
  }
  if (!res.ok) {
    throw new Error("Erreur lors de la suppression du commentaire.");
  }
}
