import { useCallback, useEffect, useState } from "react";
import PageHeader from "./components/PageHeader.tsx";
import ArticleList from "./components/ArticleList.tsx";
import ArticleForm from "./components/ArticleForm.tsx";
import LoadingMessage from "./components/LoadingMessage.tsx";
import FeedbackMessage from "./components/FeedbackMessage.tsx";
import type { FeedbackType } from "./components/FeedbackMessage.tsx";
import {
  fetchRecentArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from "./api/articles.ts";
import type {
  CreateArticlePayload,
  UpdateArticlePayload,
} from "./api/articles.ts";
import type { Article } from "./data/articleSample.ts";
import "./App.css";

type Mode = "list" | "create" | "edit";

interface Feedback {
  type: FeedbackType;
  message: string;
}

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<Mode>("list");
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Bandeau action (création / édition / suppression) — remplace alert()
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const loadArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchRecentArticles();
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
    loadArticles();
  }, [loadArticles]);

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
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Erreur à la création.",
      });
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
      setFeedback({
        type: "error",
        message:
          err instanceof Error ? err.message : "Erreur à la modification.",
      });
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
      setFeedback({
        type: "error",
        message:
          err instanceof Error ? err.message : "Erreur à la suppression.",
      });
    }
  }

  return (
    <div className="app">
      <PageHeader title="Back-office — Blog Java" />

      <main>
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
          />
        )}
      </main>
    </div>
  );
}

export default App;
