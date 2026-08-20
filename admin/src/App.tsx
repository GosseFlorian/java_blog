import { useCallback, useEffect, useState } from "react";
import PageHeader from "./components/PageHeader.tsx";
import ArticleList from "./components/ArticleList.tsx";
import ArticleForm from "./components/ArticleForm.tsx";
import LoadingMessage from "./components/LoadingMessage.tsx";
import {
  fetchRecentArticles,
  createArticle,
  updateArticle,
} from "./api/articles.ts";
import type {
  CreateArticlePayload,
  UpdateArticlePayload,
} from "./api/articles.ts";
import type { Article } from "./data/articleSample.ts";
import "./App.css";

type Mode = "list" | "create" | "edit";

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<Mode>("list");
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

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

  function showList() {
    setMode("list");
    setEditingArticle(null);
  }

  function showCreate() {
    setMode("create");
    setEditingArticle(null);
  }

  function handleEdit(id: number) {
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
      showList();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur à la création");
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
      showList();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur à la modification");
    }
  }

  function handleDelete(id: number) {
    console.log("DELETE — étape 06, id =", id);
  }

  return (
    <div className="app">
      <PageHeader title="Back-office — Blog Java" />

      <main>
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
