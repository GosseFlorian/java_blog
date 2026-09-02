/**
 * client.ts — URL de base et en-têtes HTTP communs.
 */

const TOKEN_KEY = "java_blog_token";

export const API_URL = "http://localhost:8080";

export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    return {};
  }
  return { Authorization: `Bearer ${token}` };
}

export function adminJsonHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
  };
}
