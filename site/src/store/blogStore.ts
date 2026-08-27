import { create } from "zustand";
import { fetchArticle, fetchArticles } from "../api/articles";
import type { Article } from "../api/articles";
import {
  createComment,
  fetchComments,
} from "../api/commentaires";
import type { Commentaire, CommentairePayload } from "../api/commentaires";

/**
 * Store zustand — état partagé du site public (liste + détail + commentaires).
 *
 * Objectif : éviter le props drilling entre HomePage / ArticlePage et leurs
 * sous-composants (ArticleList, ArticleCard, CommentList, CommentForm) —
 * chaque composant lit directement ce dont il a besoin via un sélecteur.
 */
interface BlogState {
  // Liste des articles publiés (HomePage)
  articles: Article[];
  articlesLoading: boolean;
  articlesError: string | null;
  loadArticles: () => Promise<void>;

  // Article actuellement affiché (ArticlePage)
  currentArticle: Article | null;
  currentArticleLoading: boolean;
  currentArticleError: string | null;
  loadArticle: (id: number) => Promise<void>;
  resetCurrentArticle: () => void;

  // Commentaires de l'article actuellement affiché
  comments: Commentaire[];
  commentsLoading: boolean;
  commentsError: string | null;
  loadComments: (articleId: number) => Promise<void>;

  // Envoi d'un nouveau commentaire
  commentSubmitting: boolean;
  commentSubmitError: string | null;
  submitComment: (
    articleId: number,
    payload: CommentairePayload,
  ) => Promise<boolean>;
}

export const useBlogStore = create<BlogState>((set, get) => ({
  articles: [],
  articlesLoading: false,
  articlesError: null,
  async loadArticles() {
    set({ articlesLoading: true, articlesError: null });
    try {
      const articles = await fetchArticles();
      set({ articles, articlesLoading: false });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Impossible de charger les articles.";
      set({ articlesError: message, articlesLoading: false });
    }
  },

  currentArticle: null,
  currentArticleLoading: false,
  currentArticleError: null,
  async loadArticle(id: number) {
    set({
      currentArticleLoading: true,
      currentArticleError: null,
      currentArticle: null,
    });
    try {
      const article = await fetchArticle(id);
      if (!article) {
        set({
          currentArticleError: "Article introuvable.",
          currentArticleLoading: false,
        });
        return;
      }
      set({ currentArticle: article, currentArticleLoading: false });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Impossible de charger l'article.";
      set({ currentArticleError: message, currentArticleLoading: false });
    }
  },
  resetCurrentArticle() {
    set({
      currentArticle: null,
      currentArticleError: null,
      currentArticleLoading: false,
      comments: [],
      commentsError: null,
      commentSubmitError: null,
    });
  },

  comments: [],
  commentsLoading: false,
  commentsError: null,
  async loadComments(articleId: number) {
    set({ commentsLoading: true, commentsError: null });
    try {
      const comments = await fetchComments(articleId);
      set({ comments, commentsLoading: false });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de charger les commentaires.";
      set({ commentsError: message, commentsLoading: false });
    }
  },

  commentSubmitting: false,
  commentSubmitError: null,
  async submitComment(articleId: number, payload: CommentairePayload) {
    set({ commentSubmitting: true, commentSubmitError: null });
    try {
      const created = await createComment(articleId, payload);
      set({
        comments: [created, ...get().comments],
        commentSubmitting: false,
      });
      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Impossible d'envoyer le commentaire.";
      set({ commentSubmitError: message, commentSubmitting: false });
      return false;
    }
  },
}));
