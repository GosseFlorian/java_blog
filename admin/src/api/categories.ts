import { getAuthHeaders } from "./auth.ts";
import { API_URL } from "./articles.ts";

export interface Categorie {
  id: number;
  nom: string;
  description: string;
}

export interface CreateCategoriePayload {
  nom: string;
  description: string;
}

export interface UpdateCategoriePayload {
  nom: string;
  description: string;
}

function adminJsonHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
  };
}

export async function fetchCategories(): Promise<Categorie[]> {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status}`);
  }
  return response.json();
}

export async function createCategory(
  payload: CreateCategoriePayload,
): Promise<Categorie> {
  const response = await fetch(`${API_URL}/admin/categories`, {
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

export async function updateCategory(
  id: number,
  payload: UpdateCategoriePayload,
): Promise<Categorie> {
  const response = await fetch(`${API_URL}/admin/categories/${id}`, {
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

export async function deleteCategory(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/admin/categories/${id}`, {
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
