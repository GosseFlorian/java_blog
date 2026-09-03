import { useState, type SubmitEvent } from 'react';
import type { LoginCredentials } from '../api/auth.ts';

/**
 * LoginForm — connexion admin.
 * Props :
 *   - onSubmit : (credentials) => void — parent appelle login()
 *   - errorMessage : string | null — message d'erreur affiché
 *   - isSubmitting : boolean — désactive le bouton pendant l'appel API
 */
interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void;
  errorMessage: string | null;
  isSubmitting: boolean;
}

function LoginForm({ onSubmit, errorMessage, isSubmitting }: LoginFormProps) {
  const [mail, setMail] = useState('');
  const [mdp, setMdp] = useState('');

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({ mail, mdp });
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Connexion admin</h2>
      <p className="login-hint">
        Compte démo : <strong>alice@example.com</strong> / <strong>demo1234</strong>
      </p>

      {errorMessage && (
        <p className="error-message" role="alert">
          {errorMessage}
        </p>
      )}

      <label>
        Adresse mail
        <input
          type="email"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          required
          autoComplete="username"
        />
      </label>

      <label>
        Mot de passe
        <input
          type="password"
          value={mdp}
          onChange={(e) => setMdp(e.target.value)}
          required
          autoComplete="current-password"
        />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Connexion…' : 'Se connecter'}
      </button>
    </form>
  );
}

export default LoginForm;
