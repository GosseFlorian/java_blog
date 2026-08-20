/**
 * articles.ts — appels HTTP vers l'API Spring Boot (partie 03).
 * Toutes les fonctions fetch du back-office passent par ici.
 */

// Adresse de l'API Java — même machine, port 8080 (pas 5173 !)
export const API_URL = "http://localhost:8080";

import type { Article } from "../data/articleSample.ts";

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

/**
 * Récupère les 5 articles les plus récents (GET /articles/recents).
 * @returns tableau d'objets { id, titre, contenu, publie, date }
 */
export async function fetchRecentArticles(): Promise<Article[]> {
  const response = await fetch(`${API_URL}/articles/recents`);

  // response.ok = true si status HTTP 200–299
  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status} sur /articles/recents`);
  }

  return response.json();
}

export async function fetchPublishedArticles(): Promise<Article[]> {
  const response = await fetch(`${API_URL}/articles`);
  if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);
  return response.json();
}

/**
 * Crée un article (POST /admin/articles).
 */
export async function createArticle(
  payload: CreateArticlePayload,
): Promise<Article> {
  const response = await fetch(`${API_URL}/admin/articles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status} lors de la création`);
  }

  return response.json();
}

/**
 * Modifie un article (PUT /admin/articles/{id}).
 */
export async function updateArticle(
  id: number,
  payload: UpdateArticlePayload,
): Promise<Article> {
  const response = await fetch(`${API_URL}/admin/articles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status} lors de la modification`);
  }

  return response.json();
}

/**
 * Supprime un article (DELETE /admin/articles/{id}).
 */
export async function deleteArticle(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/admin/articles/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status} lors de la suppression`);
  }

  // 204 No Content — pas de corps JSON à lire
}
