import { useState, type SubmitEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

function LoginPage() {
  const [mail, setMail] = useState('');
  const [mdp, setMdp] = useState('');

  const login = useAuthStore((state) => state.login);
  const submitting = useAuthStore((state) => state.authSubmitting);
  const error = useAuthStore((state) => state.authError);
  const navigate = useNavigate();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const ok = await login({ mail, mdp });
    if (ok) {
      navigate('/');
    }
  }

  return (
    <main className="auth-page">
      <h1>Connexion</h1>
      <p className="login-hint">
        Compte démo : <strong>alice@example.com</strong> / <strong>demo1234</strong>
      </p>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
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

        <button type="submit" disabled={submitting}>
          {submitting ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>

      <p className="auth-switch">
        Pas encore de compte ? <Link to="/inscription">Créer un compte</Link>
      </p>
    </main>
  );
}

export default LoginPage;
