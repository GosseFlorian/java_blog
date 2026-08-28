import { useCallback, useEffect, useState } from "react";
import PageHeader from "./components/PageHeader.tsx";
import AdminNav from "./components/AdminNav.tsx";
import type { AdminSection } from "./components/AdminNav.tsx";
import ArticleList from "./components/ArticleList.tsx";
import ArticleForm from "./components/ArticleForm.tsx";
import CategorieList from "./components/CategorieList.tsx";
import CategorieForm from "./components/CategorieForm.tsx";
import UserList from "./components/UserList.tsx";
import ArticleView from "./components/ArticleView.tsx";
import LoadingMessage from "./components/LoadingMessage.tsx";
import FeedbackMessage from "./components/FeedbackMessage.tsx";
import type { FeedbackType } from "./components/FeedbackMessage.tsx";
import LoginForm from "./components/LoginForm.tsx";
import {
  fetchAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  fetchArticleCategories,
  updateArticleCategories,
  enrichArticlesWithCategories,
} from "./api/articles.ts";
import type {
  CreateArticlePayload,
  UpdateArticlePayload,
} from "./api/articles.ts";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "./api/categories.ts";
import type {
  Categorie,
  CreateCategoriePayload,
  UpdateCategoriePayload,
} from "./api/categories.ts";
import { fetchUsers, deleteUser } from "./api/users.ts";
import type { User } from "./api/users.ts";
import { login, logout, isLoggedIn, getPseudo, getUserId } from "./api/auth.ts";
import type { LoginCredentials } from "./api/auth.ts";
import type { Article } from "./data/articleSample.ts";
import "./App.css";

type Mode = "list" | "create" | "edit" | "view";

interface Feedback {
  type: FeedbackType;
  message: string;
}

function App() {
  const [authenticated, setAuthenticated] = useState(isLoggedIn());
  const [pseudo, setPseudo] = useState(getPseudo());
  const [userId, setUserId] = useState<number | null>(getUserId());
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [section, setSection] = useState<AdminSection>("articles");
  const [mode, setMode] = useState<Mode>("list");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editingArticleCategoryIds, setEditingArticleCategoryIds] = useState<
    number[]
  >([]);
  const [editingCategorie, setEditingCategorie] = useState<Categorie | null>(
    null,
  );
  const [viewingArticleId, setViewingArticleId] = useState<number | null>(null);

  const loadArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchAllArticles();
      const enriched = await enrichArticlesWithCategories(data);
      setArticles(enriched);
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Impossible de joindre l'API.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Impossible de joindre l'API.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchUsers();
      setUsers(data);
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
    if (!authenticated) return;

    setMode("list");
    setEditingArticle(null);
    setEditingCategorie(null);

    if (section === "articles") {
      loadArticles();
      fetchCategories()
        .then(setCategories)
        .catch((err) => {
          console.error(err);
        });
    } else if (section === "categories") {
      loadCategories();
    } else {
      loadUsers();
    }
  }, [authenticated, section, loadArticles, loadCategories, loadUsers]);

  async function handleLoginSubmit(credentials: LoginCredentials) {
    try {
      setIsLoggingIn(true);
      setLoginError(null);
      const data = await login(credentials);
      setAuthenticated(true);
      setPseudo(data.pseudo);
      setUserId(data.userId);
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
    setUserId(null);
    setArticles([]);
    setCategories([]);
    setUsers([]);
    setSection("articles");
    setMode("list");
    setEditingArticle(null);
    setEditingCategorie(null);
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
    setEditingCategorie(null);
    setViewingArticleId(null);
  }

  function handleSectionChange(next: AdminSection) {
    setSection(next);
    setMode("list");
    setEditingArticle(null);
    setEditingCategorie(null);
    setViewingArticleId(null);
    clearFeedback();
    setError(null);
  }

  function handleViewArticle(id: number) {
    clearFeedback();
    setViewingArticleId(id);
    setMode("view");
  }

  function showCreate() {
    clearFeedback();
    setMode("create");
    setEditingArticle(null);
    setEditingCategorie(null);
  }

  async function handleEditArticle(id: number) {
    clearFeedback();
    const article = articles.find((a) => a.id === id);
    if (!article) return;

    try {
      const articleCategories = await fetchArticleCategories(id);
      setEditingArticleCategoryIds(articleCategories.map((c) => c.id));
      setEditingArticle(article);
      setMode("edit");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Impossible de charger les catégories.";
      handleSessionExpired(message);
      setFeedback({ type: "error", message });
    }
  }

  function handleEditCategorie(id: number) {
    clearFeedback();
    const categorie = categories.find((c) => c.id === id);
    if (categorie) {
      setEditingCategorie(categorie);
      setMode("edit");
    }
  }

  async function handleCreateArticleSubmit(
    payload: CreateArticlePayload | (UpdateArticlePayload & { id: number }),
    categorieIds?: number[],
  ) {
    try {
      const created = await createArticle(payload as CreateArticlePayload);
      if (categorieIds != null && categorieIds.length > 0) {
        await updateArticleCategories(created.id, categorieIds);
      }
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

  async function handleEditArticleSubmit(
    payload: CreateArticlePayload | (UpdateArticlePayload & { id: number }),
    categorieIds?: number[],
  ) {
    try {
      const editPayload = payload as UpdateArticlePayload & { id: number };
      await updateArticle(editPayload.id, {
        titre: editPayload.titre,
        contenu: editPayload.contenu,
        publie: editPayload.publie,
      });
      if (categorieIds != null) {
        await updateArticleCategories(editPayload.id, categorieIds);
      }
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

  async function handleDeleteArticle(id: number) {
    clearFeedback();
    const article = articles.find((a) => a.id === id);
    const titre = article?.titre ?? `#${id}`;

    if (
      !window.confirm(
        `Supprimer l'article « ${titre} » ?\n\nCette action est définitive.`,
      )
    ) {
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

  async function handleCreateCategorieSubmit(
    payload:
      | CreateCategoriePayload
      | (UpdateCategoriePayload & { id: number }),
  ) {
    try {
      await createCategory(payload as CreateCategoriePayload);
      await loadCategories();
      setFeedback({ type: "success", message: "Catégorie créée." });
      showList();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur à la création.";
      handleSessionExpired(message);
      setFeedback({ type: "error", message });
    }
  }

  async function handleEditCategorieSubmit(
    payload:
      | CreateCategoriePayload
      | (UpdateCategoriePayload & { id: number }),
  ) {
    try {
      const editPayload = payload as UpdateCategoriePayload & { id: number };
      await updateCategory(editPayload.id, {
        nom: editPayload.nom,
        description: editPayload.description,
      });
      await loadCategories();
      setFeedback({ type: "success", message: "Catégorie enregistrée." });
      showList();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur à la modification.";
      handleSessionExpired(message);
      setFeedback({ type: "error", message });
    }
  }

  async function handleDeleteCategorie(id: number) {
    clearFeedback();
    const categorie = categories.find((c) => c.id === id);
    const nom = categorie?.nom ?? `#${id}`;

    if (
      !window.confirm(
        `Supprimer la catégorie « ${nom} » ?\n\nCette action est définitive.`,
      )
    ) {
      return;
    }

    try {
      await deleteCategory(id);
      await loadCategories();
      setFeedback({ type: "success", message: "Catégorie supprimée." });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur à la suppression.";
      handleSessionExpired(message);
      setFeedback({ type: "error", message });
    }
  }

  async function handleDeleteUser(id: number) {
    clearFeedback();
    const user = users.find((u) => u.id === id);
    const label = user?.pseudo ?? `#${id}`;

    if (
      !window.confirm(
        `Supprimer l'utilisateur « ${label} » ?\n\nCette action est définitive.`,
      )
    ) {
      return;
    }

    try {
      await deleteUser(id);
      await loadUsers();
      setFeedback({ type: "success", message: "Utilisateur supprimé." });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur à la suppression.";
      handleSessionExpired(message);
      setFeedback({ type: "error", message });
    }
  }

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

  return (
    <div className="app">
      <PageHeader
        title="Back-office — Blog Java"
        pseudo={pseudo}
        onLogout={handleLogout}
      />

      <AdminNav active={section} onChange={handleSectionChange} />

      <main>
        {feedback && (
          <FeedbackMessage
            type={feedback.type}
            message={feedback.message}
            onClose={clearFeedback}
          />
        )}

        {section === "articles" && mode === "list" && (
          <div className="toolbar">
            <button type="button" onClick={showCreate}>
              + Nouvel article
            </button>
          </div>
        )}

        {section === "categories" && mode === "list" && (
          <div className="toolbar">
            <button type="button" onClick={showCreate}>
              + Nouvelle catégorie
            </button>
          </div>
        )}

        {section === "articles" && mode === "create" && userId != null && (
          <ArticleForm
            key="create-article"
            initialValues={null}
            allCategories={categories}
            initialCategoryIds={[]}
            connectedUserId={userId}
            submitLabel="Créer"
            onSubmit={handleCreateArticleSubmit}
            onCancel={showList}
            showBackButton
          />
        )}

        {section === "articles" && mode === "edit" && editingArticle && userId != null && (
          <ArticleForm
            key={editingArticle.id}
            initialValues={editingArticle}
            allCategories={categories}
            initialCategoryIds={editingArticleCategoryIds}
            connectedUserId={userId}
            submitLabel="Enregistrer"
            onSubmit={handleEditArticleSubmit}
            onCancel={showList}
            showBackButton
          />
        )}

        {section === "articles" && mode === "view" && viewingArticleId != null && (
          <ArticleView
            articleId={viewingArticleId}
            onBack={showList}
            onSessionExpired={handleSessionExpired}
          />
        )}

        {section === "categories" && mode === "create" && (
          <CategorieForm
            key="create-categorie"
            initialValues={null}
            submitLabel="Créer"
            onSubmit={handleCreateCategorieSubmit}
            onCancel={showList}
            showBackButton
          />
        )}

        {section === "categories" && mode === "edit" && editingCategorie && (
          <CategorieForm
            key={editingCategorie.id}
            initialValues={editingCategorie}
            submitLabel="Enregistrer"
            onSubmit={handleEditCategorieSubmit}
            onCancel={showList}
            showBackButton
          />
        )}

        {mode === "list" && isLoading && <LoadingMessage />}

        {mode === "list" && error && <p className="error-message">{error}</p>}

        {section === "articles" && mode === "list" && !isLoading && !error && (
          <ArticleList
            articles={articles}
            onEdit={handleEditArticle}
            onDelete={handleDeleteArticle}
            onView={handleViewArticle}
          />
        )}

        {section === "categories" && mode === "list" && !isLoading && !error && (
          <CategorieList
            categories={categories}
            onEdit={handleEditCategorie}
            onDelete={handleDeleteCategorie}
          />
        )}

        {section === "users" && mode === "list" && !isLoading && !error && (
          <UserList users={users} onDelete={handleDeleteUser} />
        )}
      </main>
    </div>
  );
}

export default App;
