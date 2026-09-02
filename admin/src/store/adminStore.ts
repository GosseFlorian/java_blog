import { create } from "zustand";
import type { AdminSection } from "../components/AdminNav.tsx";
import type { FeedbackType } from "../components/FeedbackMessage.tsx";
import {
  fetchAllArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  fetchArticleCategories,
  updateArticleCategories,
  enrichArticlesWithCategories,
} from "../api/articles.ts";
import { fetchCategories } from "../api/categories.ts";
import type {
  CreateArticlePayload,
  UpdateArticlePayload,
} from "../api/articles.ts";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categories.ts";
import type {
  Categorie,
  CreateCategoriePayload,
  UpdateCategoriePayload,
} from "../api/categories.ts";
import { fetchUsers, deleteUser } from "../api/users.ts";
import type { User } from "../api/users.ts";
import type { Article } from "../types/article.ts";
import { useAuthStore } from "./authStore.ts";

type Mode = "list" | "create" | "edit" | "view";

interface Feedback {
  type: FeedbackType;
  message: string;
}

interface AdminState {
  section: AdminSection;
  mode: Mode;
  feedback: Feedback | null;
  articles: Article[];
  categories: Categorie[];
  users: User[];
  isLoading: boolean;
  error: string | null;
  editingArticle: Article | null;
  editingArticleCategoryIds: number[];
  editingCategorie: Categorie | null;
  viewingArticleId: number | null;

  setSection: (section: AdminSection) => void;
  loadCurrentSection: () => Promise<void>;
  reset: () => void;
  clearFeedback: () => void;
  showList: () => void;
  showCreate: () => void;
  handleViewArticle: (id: number) => void;
  handleEditArticle: (id: number) => Promise<void>;
  handleEditCategorie: (id: number) => void;
  handleCreateArticleSubmit: (
    payload: CreateArticlePayload | (UpdateArticlePayload & { id: number }),
    categorieIds?: number[],
  ) => Promise<void>;
  handleEditArticleSubmit: (
    payload: CreateArticlePayload | (UpdateArticlePayload & { id: number }),
    categorieIds?: number[],
  ) => Promise<void>;
  handleDeleteArticle: (id: number) => Promise<void>;
  handleCreateCategorieSubmit: (
    payload:
      | CreateCategoriePayload
      | (UpdateCategoriePayload & { id: number }),
  ) => Promise<void>;
  handleEditCategorieSubmit: (
    payload:
      | CreateCategoriePayload
      | (UpdateCategoriePayload & { id: number }),
  ) => Promise<void>;
  handleDeleteCategorie: (id: number) => Promise<void>;
  handleDeleteUser: (id: number) => Promise<void>;
  handleSessionExpired: (message: string) => void;
}

const initialState = {
  section: "articles" as AdminSection,
  mode: "list" as Mode,
  feedback: null as Feedback | null,
  articles: [] as Article[],
  categories: [] as Categorie[],
  users: [] as User[],
  isLoading: false,
  error: null as string | null,
  editingArticle: null as Article | null,
  editingArticleCategoryIds: [] as number[],
  editingCategorie: null as Categorie | null,
  viewingArticleId: null as number | null,
};

async function loadArticles(set: (partial: Partial<AdminState>) => void) {
  try {
    set({ isLoading: true, error: null });
    const data = await fetchAllArticles();
    const enriched = await enrichArticlesWithCategories(data);
    set({ articles: enriched, isLoading: false });
  } catch (err) {
    console.error(err);
    const message =
      err instanceof Error ? err.message : "Impossible de joindre l'API.";
    set({ error: message, isLoading: false });
  }
}

async function loadCategories(set: (partial: Partial<AdminState>) => void) {
  try {
    set({ isLoading: true, error: null });
    const data = await fetchCategories();
    set({ categories: data, isLoading: false });
  } catch (err) {
    console.error(err);
    const message =
      err instanceof Error ? err.message : "Impossible de joindre l'API.";
    set({ error: message, isLoading: false });
  }
}

async function loadUsers(set: (partial: Partial<AdminState>) => void) {
  try {
    set({ isLoading: true, error: null });
    const data = await fetchUsers();
    set({ users: data, isLoading: false });
  } catch (err) {
    console.error(err);
    const message =
      err instanceof Error ? err.message : "Impossible de joindre l'API.";
    set({ error: message, isLoading: false });
  }
}

export const useAdminStore = create<AdminState>((set, get) => ({
  ...initialState,

  setSection: (section) => {
    set({
      section,
      mode: "list",
      editingArticle: null,
      editingCategorie: null,
      viewingArticleId: null,
      feedback: null,
      error: null,
    });
  },

  loadCurrentSection: async () => {
    const { section } = get();
    set({
      mode: "list",
      editingArticle: null,
      editingCategorie: null,
    });

    if (section === "articles") {
      await loadArticles(set);
      fetchCategories()
        .then((data) => set({ categories: data }))
        .catch((err) => console.error(err));
    } else if (section === "categories") {
      await loadCategories(set);
    } else {
      await loadUsers(set);
    }
  },

  reset: () => set({ ...initialState }),

  clearFeedback: () => set({ feedback: null }),

  showList: () =>
    set({
      mode: "list",
      editingArticle: null,
      editingCategorie: null,
      viewingArticleId: null,
    }),

  showCreate: () => {
    get().clearFeedback();
    set({
      mode: "create",
      editingArticle: null,
      editingCategorie: null,
    });
  },

  handleViewArticle: (id) => {
    get().clearFeedback();
    set({ viewingArticleId: id, mode: "view" });
  },

  handleEditArticle: async (id) => {
    get().clearFeedback();
    const article = get().articles.find((a) => a.id === id);
    if (!article) return;

    try {
      const articleCategories = await fetchArticleCategories(id);
      set({
        editingArticleCategoryIds: articleCategories.map((c) => c.id),
        editingArticle: article,
        mode: "edit",
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de charger les catégories.";
      get().handleSessionExpired(message);
      set({ feedback: { type: "error", message } });
    }
  },

  handleEditCategorie: (id) => {
    get().clearFeedback();
    const categorie = get().categories.find((c) => c.id === id);
    if (categorie) {
      set({ editingCategorie: categorie, mode: "edit" });
    }
  },

  handleCreateArticleSubmit: async (payload, categorieIds) => {
    try {
      const created = await createArticle(payload as CreateArticlePayload);
      if (categorieIds != null && categorieIds.length > 0) {
        await updateArticleCategories(created.id, categorieIds);
      }
      await loadArticles(set);
      set({ feedback: { type: "success", message: "Article créé." } });
      get().showList();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur à la création.";
      get().handleSessionExpired(message);
      set({ feedback: { type: "error", message } });
    }
  },

  handleEditArticleSubmit: async (payload, categorieIds) => {
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
      await loadArticles(set);
      set({ feedback: { type: "success", message: "Article enregistré." } });
      get().showList();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur à la modification.";
      get().handleSessionExpired(message);
      set({ feedback: { type: "error", message } });
    }
  },

  handleDeleteArticle: async (id) => {
    get().clearFeedback();
    const article = get().articles.find((a) => a.id === id);
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
      await loadArticles(set);
      set({ feedback: { type: "success", message: "Article supprimé." } });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur à la suppression.";
      get().handleSessionExpired(message);
      set({ feedback: { type: "error", message } });
    }
  },

  handleCreateCategorieSubmit: async (payload) => {
    try {
      await createCategory(payload as CreateCategoriePayload);
      await loadCategories(set);
      set({ feedback: { type: "success", message: "Catégorie créée." } });
      get().showList();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur à la création.";
      get().handleSessionExpired(message);
      set({ feedback: { type: "error", message } });
    }
  },

  handleEditCategorieSubmit: async (payload) => {
    try {
      const editPayload = payload as UpdateCategoriePayload & { id: number };
      await updateCategory(editPayload.id, {
        nom: editPayload.nom,
        description: editPayload.description,
      });
      await loadCategories(set);
      set({ feedback: { type: "success", message: "Catégorie enregistrée." } });
      get().showList();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur à la modification.";
      get().handleSessionExpired(message);
      set({ feedback: { type: "error", message } });
    }
  },

  handleDeleteCategorie: async (id) => {
    get().clearFeedback();
    const categorie = get().categories.find((c) => c.id === id);
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
      await loadCategories(set);
      set({ feedback: { type: "success", message: "Catégorie supprimée." } });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur à la suppression.";
      get().handleSessionExpired(message);
      set({ feedback: { type: "error", message } });
    }
  },

  handleDeleteUser: async (id) => {
    get().clearFeedback();
    const user = get().users.find((u) => u.id === id);
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
      await loadUsers(set);
      set({ feedback: { type: "success", message: "Utilisateur supprimé." } });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur à la suppression.";
      get().handleSessionExpired(message);
      set({ feedback: { type: "error", message } });
    }
  },

  handleSessionExpired: (message) => {
    if (message.includes("Session expirée")) {
      useAuthStore.getState().logout();
      get().reset();
      useAuthStore.setState({
        loginError: "Session expirée — reconnecte-toi.",
      });
    }
  },
}));
