export function formatCommentAuthor(
  pseudo: string | null | undefined,
  userId: number,
): string {
  if (pseudo != null && pseudo.trim().length > 0) {
    return pseudo;
  }
  return `Utilisateur #${userId}`;
}
