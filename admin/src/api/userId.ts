const USER_ID_KEY = "java_blog_user_id";

export function getUserId(): number | null {
  const raw = localStorage.getItem(USER_ID_KEY);
  if (raw == null) return null;
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? null : parsed;
}

export function setUserId(userId: number): void {
  localStorage.setItem(USER_ID_KEY, String(userId));
}

export function clearUserId(): void {
  localStorage.removeItem(USER_ID_KEY);
}
