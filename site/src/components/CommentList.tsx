import type { Commentaire } from "../api/commentaires";

interface CommentListProps {
  comments: Commentaire[];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="empty-list">
        Aucun commentaire pour l'instant. Soyez le premier à réagir !
      </p>
    );
  }

  return (
    <ul className="comment-list">
      {comments.map((comment) => (
        <li key={comment.id} className="comment-item">
          <p className="comment-meta">
            Utilisateur #{comment.userId} — {formatDate(comment.date)}
          </p>
          <p className="comment-contenu">{comment.contenu}</p>
        </li>
      ))}
    </ul>
  );
}

export default CommentList;
