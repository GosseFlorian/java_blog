import type { User } from "../api/users.ts";

interface UserCardProps {
  user: User;
  onDelete: (id: number) => void;
}

function UserCard({ user, onDelete }: UserCardProps) {
  const { id, pseudo, mail } = user;

  return (
    <article className="article-card user-card">
      <h2>{pseudo}</h2>
      <p className="article-contenu">{mail}</p>
      <div className="article-actions">
        <button type="button" onClick={() => onDelete(id)}>
          Supprimer
        </button>
      </div>
    </article>
  );
}

export default UserCard;
