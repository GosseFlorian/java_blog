import { useCallback, useEffect, useState } from "react";
import PageHeader from "./components/PageHeader.tsx";
import ArticleList from "./components/ArticleList.tsx";
import ArticleForm from "./components/ArticleForm.tsx";
import LoadingMessage from "./components/LoadingMessage.tsx";
import FeedbackMessage from "./components/FeedbackMessage.tsx";
import type { FeedbackType } from "./components/FeedbackMessage.tsx";
import LoginForm from "./components/LoginForm.tsx";
import {
  fetchArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  publishArticle,
  unpublishArticle,
} from "./api/articles.ts";
import type {
  CreateArticlePayload,
  UpdateArticlePayload,
} from "./api/articles.ts";
import { login, logout, isLoggedIn, getPseudo } from "./api/auth.ts";
import type { LoginCredentials } from "./api/auth.ts";
import type { Article } from "./data/articleSample.ts";
import "./App.css";

type Mode = "list" | "create" | "edit";

interface Feedback {
  type: FeedbackType;
  message: string;
}

function App() {
  const [authenticated, setAuthenticated] = useState(isLoggedIn());
  const [pseudo, setPseudo] = useState(getPseudo());
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<Mode>("list");
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [togglingPublishId, setTogglingPublishId] = useState<number | null>(
    null,
  );

  const loadArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchArticles();
      setArticles(data);
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Impossible de joindre l'API.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadArticles();
    }
  }, [authenticated, loadArticles]);

  async function handleLoginSubmit(credentials: LoginCredentials) {
    try {
      setIsLoggingIn(true);
      setLoginError(null);
      const data = await login(credentials);
      setAuthenticated(true);
      setPseudo(data.pseudo);
    } catch (err) {
      setLoginError(
        err instanceof Error ? err.message : "Connexion impossible.",
      );
    } finally {
      setIsLoggingIn(false);
    }
  }

  function handleLogout() {
    logout();
    setAuthenticated(false);
    setPseudo(null);
    setArticles([]);
    setMode("list");
    setEditingArticle(null);
    setFeedback(null);
    setError(null);
  }

  function handleSessionExpired(message: string) {
    if (message.includes("Session expirée")) {
      handleLogout();
      setLoginError("Session expirée — reconnecte-toi.");
    }
  }

  function clearFeedback() {
    setFeedback(null);
  }

  function showList() {
    setMode("list");
    setEditingArticle(null);
  }

  function showCreate() {
    clearFeedback();
    setMode("create");
    setEditingArticle(null);
  }

  function handleEdit(id: number) {
    clearFeedback();
    const article = articles.find((a) => a.id === id);
    if (article) {
      setEditingArticle(article);
      setMode("edit");
    }
  }

  async function handleCreateSubmit(
    payload: CreateArticlePayload | (UpdateArticlePayload & { id: number }),
  ) {
    try {
      await createArticle(payload as CreateArticlePayload);
      await loadArticles();
      setFeedback({ type: "success", message: "Article créé." });
      showList();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur à la création.";
      handleSessionExpired(message);
      setFeedback({ type: "error", message });
    }
  }

  async function handleEditSubmit(
    payload: CreateArticlePayload | (UpdateArticlePayload & { id: number }),
  ) {
    try {
      const editPayload = payload as UpdateArticlePayload & { id: number };
      await updateArticle(editPayload.id, {
        titre: editPayload.titre,
        contenu: editPayload.contenu,
        publie: editPayload.publie,
      });
      await loadArticles();
      setFeedback({ type: "success", message: "Article enregistré." });
      showList();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur à la modification.";
      handleSessionExpired(message);
      setFeedback({ type: "error", message });
    }
  }

  async function handleTogglePublish(id: number, publie: boolean) {
    clearFeedback();
    try {
      setTogglingPublishId(id);
      if (publie) {
        await unpublishArticle(id);
      } else {
        await publishArticle(id);
      }
      await loadArticles();
      setFeedback({
        type: "success",
        message: publie ? "Article dépublié." : "Article publié.",
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur lors du changement de statut.";
      handleSessionExpired(message);
      setFeedback({ type: "error", message });
    } finally {
      setTogglingPublishId(null);
    }
  }

  async function handleDelete(id: number) {
    clearFeedback();

    const article = articles.find((a) => a.id === id);
    const titre = article?.titre ?? `#${id}`;

    const confirmed = window.confirm(
      `Supprimer l'article « ${titre} » ?\n\nCette action est définitive.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteArticle(id);
      await loadArticles();
      setFeedback({ type: "success", message: "Article supprimé." });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur à la suppression.";
      handleSessionExpired(message);
      setFeedback({ type: "error", message });
    }
  }

  // ─── Écran login ───
  if (!authenticated) {
    return (
      <div className="app">
        <PageHeader title="Back-office — Blog Java" />
        <main>
          <LoginForm
            onSubmit={handleLoginSubmit}
            errorMessage={loginError}
            isSubmitting={isLoggingIn}
          />
        </main>
      </div>
    );
  }

  // ─── Back-office (partie 04 + auth) ───
  return (
    <div className="app">
      <PageHeader title="Back-office — Blog Java" />

      <main>
        <div className="user-bar">
          <span>
            Connecté : <strong>{pseudo}</strong>
          </span>
          <button type="button" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>

        {feedback && (
          <FeedbackMessage
            type={feedback.type}
            message={feedback.message}
            onClose={clearFeedback}
          />
        )}

        {mode === "list" && (
          <div className="toolbar">
            <button type="button" onClick={showCreate}>
              + Nouvel article
            </button>
          </div>
        )}

        {mode === "create" && (
          <ArticleForm
            key="create"
            initialValues={null}
            submitLabel="Créer"
            onSubmit={handleCreateSubmit}
            onCancel={showList}
          />
        )}

        {mode === "edit" && editingArticle && (
          <ArticleForm
            key={editingArticle.id}
            initialValues={editingArticle}
            submitLabel="Enregistrer"
            onSubmit={handleEditSubmit}
            onCancel={showList}
          />
        )}

        {mode === "list" && isLoading && <LoadingMessage />}

        {mode === "list" && error && <p className="error-message">{error}</p>}

        {mode === "list" && !isLoading && !error && (
          <ArticleList
            articles={articles}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onTogglePublish={handleTogglePublish}
            togglingPublishId={togglingPublishId}
          />
        )}
      </main>
    </div>
  );
}

export default App;
