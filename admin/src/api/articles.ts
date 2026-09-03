/**
 * articles.ts — appels HTTP vers l'API Spring Boot.
 */

import { API_URL, getAuthHeaders, adminJsonHeaders } from './client.ts';
import type { Article, ArticleCategory } from '../types/article.ts';

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
 * Récupère tous les articles (GET admin).
 */
export async function fetchAllArticles(): Promise<Article[]> {
  const response = await fetch(`${API_URL}/admin/articles`, {
    headers: getAuthHeaders(),
  });

  if (response.status === 401) {
    throw new Error('Session expirée — reconnecte-toi.');
  }
  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status}`);
  }

  return response.json();
}

export async function fetchArticleById(id: number): Promise<Article> {
  const response = await fetch(`${API_URL}/admin/articles/${id}`, {
    headers: getAuthHeaders(),
  });

  if (response.status === 401) {
    throw new Error('Session expirée — reconnecte-toi.');
  }
  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Récupère les 5 articles les plus récents (GET public).
 */
export async function fetchRecentArticles(): Promise<Article[]> {
  const response = await fetch(`${API_URL}/articles/recents`);

  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status}`);
  }

  return response.json();
}

export async function createArticle(payload: CreateArticlePayload): Promise<Article> {
  const response = await fetch(`${API_URL}/admin/articles`, {
    method: 'POST',
    headers: adminJsonHeaders(),
    body: JSON.stringify(payload),
  });

  if (response.status === 401) {
    throw new Error('Session expirée — reconnecte-toi.');
  }
  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status} lors de la création`);
  }

  return response.json();
}

export async function updateArticle(id: number, payload: UpdateArticlePayload): Promise<Article> {
  const response = await fetch(`${API_URL}/admin/articles/${id}`, {
    method: 'PUT',
    headers: adminJsonHeaders(),
    body: JSON.stringify(payload),
  });

  if (response.status === 401) {
    throw new Error('Session expirée — reconnecte-toi.');
  }
  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status} lors de la modification`);
  }

  return response.json();
}

export async function fetchArticleCategories(id: number): Promise<ArticleCategory[]> {
  const response = await fetch(`${API_URL}/admin/articles/${id}/categories`, {
    headers: getAuthHeaders(),
  });

  if (response.status === 401) {
    throw new Error('Session expirée — reconnecte-toi.');
  }
  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status}`);
  }

  return response.json();
}

export async function updateArticleCategories(id: number, categorieIds: number[]): Promise<void> {
  const response = await fetch(`${API_URL}/admin/articles/${id}/categories`, {
    method: 'PUT',
    headers: adminJsonHeaders(),
    body: JSON.stringify({ categorieIds }),
  });

  if (response.status === 401) {
    throw new Error('Session expirée — reconnecte-toi.');
  }
  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status} lors de la mise à jour des catégories`);
  }
}

export async function enrichArticlesWithCategories(articles: Article[]): Promise<Article[]> {
  return Promise.all(
    articles.map(async (article) => {
      try {
        const categories = await fetchArticleCategories(article.id);
        return { ...article, categories };
      } catch {
        return { ...article, categories: [] };
      }
    })
  );
}

export async function deleteArticle(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/admin/articles/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (response.status === 401) {
    throw new Error('Session expirée — reconnecte-toi.');
  }
  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status} lors de la suppression`);
  }
}
