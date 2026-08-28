import { API_URL, getAuthHeaders } from "./client.ts";

export interface User {
  id: number;
  pseudo: string;
  mail: string;
}

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/admin/users`, {
    headers: getAuthHeaders(),
  });

  if (response.status === 401) {
    throw new Error("Session expirée — reconnecte-toi.");
  }
  if (!response.ok) {
    throw new Error(`Erreur HTTP ${response.status}`);
  }

  return response.json();
}

export async function deleteUser(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/admin/users/${id}`, {
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
