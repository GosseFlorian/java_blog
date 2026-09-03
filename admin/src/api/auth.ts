/**
 * auth.ts — login, logout, stockage du JWT (partie 05).
 */

import { API_URL, getAuthHeaders } from './client.ts';
import { clearUserId, setUserId } from './userId.ts';

const TOKEN_KEY = 'java_blog_token';
const PSEUDO_KEY = 'java_blog_pseudo';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export { getUserId } from './userId.ts';
export { getAuthHeaders };

export function getPseudo(): string | null {
  return localStorage.getItem(PSEUDO_KEY);
}

export function isLoggedIn(): boolean {
  const token = getToken();
  return token != null && token.length > 0;
}

export interface LoginCredentials {
  mail: string;
  mdp: string;
}

export interface LoginResponse {
  token: string;
  pseudo: string;
  userId: number;
}

/**
 * Connexion — POST /auth/login
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Identifiants invalides');
  }

  const data: LoginResponse = await response.json();

  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(PSEUDO_KEY, data.pseudo);
  setUserId(data.userId);

  return data;
}

/** Déconnexion — efface le badge côté client (pas d'appel /auth/logout en v1). */
export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PSEUDO_KEY);
  clearUserId();
}
