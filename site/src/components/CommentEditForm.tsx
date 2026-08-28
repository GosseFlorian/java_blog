import { useState, type FormEvent } from "react";

interface CommentEditFormProps {
  initialContenu: string;
  onSubmit: (contenu: string) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting: boolean;
  error: string | null;
}

function CommentEditForm({
  initialContenu,
  onSubmit,
  onCancel,
  isSubmitting,
  error,
}: CommentEditFormProps) {
  const [contenu, setContenu] = useState(initialContenu);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(contenu);
  }

  return (
    <form className="comment-form comment-edit-form" onSubmit={handleSubmit}>
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      <label>
        Modifier votre message
        <textarea
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          rows={4}
          required
        />
      </label>

      <div className="comment-form-actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement…" : "Enregistrer"}
        </button>
        <button type="button" onClick={onCancel} disabled={isSubmitting}>
          Annuler
        </button>
      </div>
    </form>
  );
}

export default CommentEditForm;
