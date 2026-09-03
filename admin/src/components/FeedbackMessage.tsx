/**
 * FeedbackMessage — bandeau succès ou erreur.
 * Props :
 *   - type : "success" | "error"
 *   - message : string — texte affiché
 *   - onClose : () => void — fermer le bandeau (optionnel)
 */
export type FeedbackType = 'success' | 'error';

interface FeedbackMessageProps {
  type: FeedbackType;
  message: string;
  onClose?: () => void;
}

function FeedbackMessage({ type, message, onClose }: FeedbackMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div className={`feedback feedback-${type}`} role="alert">
      <span>{message}</span>
      {onClose && (
        <button type="button" className="feedback-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
}

export default FeedbackMessage;
