/**
 * LoadingMessage — texte affiché pendant un chargement API.
 * Props :
 *   - text (string, optionnel) — message à afficher
 */
interface LoadingMessageProps {
  text?: string;
}

function LoadingMessage({
  text = "Chargement en cours…",
}: LoadingMessageProps) {
  return <p className="loading-message">{text}</p>;
}

export default LoadingMessage;
