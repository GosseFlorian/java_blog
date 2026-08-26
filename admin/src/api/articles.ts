/**
 * articles.ts — appels HTTP vers l'API Spring Boot.
 */

import { getAuthHeaders } from "./auth.ts";
import type { Article } from "../data/articleSample.ts";

export const API_URL = "http://localhost:8080";

export interface CreateArticlePayload {
  titre: string;
  contenu: string;
  userId: number;
}

export interface UpdateArticlePayload {
  titre: string;
  contenu: string;
  publie: boolean;
}

/** En-têtes JSON + Authorization pour /admin */
function adminJsonHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
  };
}

/**
 * Récupère les 5 articles les plus récents (GET public).
 */
export async function fetchArticles(): Promise<Article[]> {
  const response = await fetch(`${API_URL}/admin/articles`, {
    method: "GET",
    headers: adminJsonHeaders(),
  });

  if (response.status === 401) {
    throw new Error("Session expirée — reconnecte-toi.");
  }

  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status}`);
  }

  return response.json();
}

export async function createArticle(
  payload: CreateArticlePayload,
): Promise<Article> {
  const response = await fetch(`${API_URL}/admin/articles`, {
    method: "POST",
    headers: adminJsonHeaders(),
    body: JSON.stringify(payload),
  });

  if (response.status === 401) {
    throw new Error("Session expirée — reconnecte-toi.");
  }
  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status} lors de la création`);
  }

  return response.json();
}

export async function updateArticle(
  id: number,
  payload: UpdateArticlePayload,
): Promise<Article> {
  const response = await fetch(`${API_URL}/admin/articles/${id}`, {
    method: "PUT",
    headers: adminJsonHeaders(),
    body: JSON.stringify(payload),
  });

  if (response.status === 401) {
    throw new Error("Session expirée — reconnecte-toi.");
  }
  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status} lors de la modification`);
  }

  return response.json();
}

/**
 * Bascule rapide publié / brouillon — PATCH /admin/articles/{id}/publier
 * et /admin/articles/{id}/depublier (204 No Content en cas de succès).
 */
export async function publishArticle(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/admin/articles/${id}/publier`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  if (response.status === 401) {
    throw new Error("Session expirée — reconnecte-toi.");
  }
  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status} lors de la publication`);
  }
}

export async function unpublishArticle(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/admin/articles/${id}/depublier`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  if (response.status === 401) {
    throw new Error("Session expirée — reconnecte-toi.");
  }
  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status} lors de la dépublication`);
  }
}

export async function deleteArticle(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/admin/articles/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (response.status === 401) {
    throw new Error("Session expirée — reconnecte-toi.");
  }
  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status} lors de la suppression`);
  }
}
