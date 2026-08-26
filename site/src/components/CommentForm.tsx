import { useState, type FormEvent } from "react";
import type { CommentairePayload } from "../api/commentaires";

interface CommentFormProps {
  onSubmit: (payload: CommentairePayload) => Promise<boolean>;
  isSubmitting: boolean;
  error: string | null;
}

/**
 * TODO(auth-visiteur) : l'API n'a pas de route publique d'inscription /
 * connexion pour un visiteur (POST /admin/users est protégé par JWT).
 * En attendant un vrai mécanisme d'authentification, ce formulaire demande
 * directement un userId existant (voir doc/blog.sql — users 1 à 10).
 * Cette saisie manuelle est un pis-aller à remplacer dès qu'une inscription
 * publique (ou une identité anonyme) existera côté backend.
 */
function CommentForm({ onSubmit, isSubmitting, error }: CommentFormProps) {
  const [contenu, setContenu] = useState("");
  const [userId, setUserId] = useState(1);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(false);

    const ok = await onSubmit({ contenu, userId: Number(userId) });

    if (ok) {
      setContenu("");
      setSuccess(true);
    }
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <h3>Laisser un commentaire</h3>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
      {success && <p className="success-message">Commentaire envoyé.</p>}

      <label>
        Votre message
        <textarea
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          rows={4}
          required
        />
      </label>

      {/* TODO(auth-visiteur) : remplacer par l'identité du visiteur connecté */}
      <label>
        ID utilisateur (démo — pas d'inscription publique pour l'instant)
        <input
          type="number"
          min={1}
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
          required
        />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Envoi…" : "Publier le commentaire"}
      </button>
    </form>
  );
}

export default CommentForm;
