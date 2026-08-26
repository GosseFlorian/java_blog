import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useBlogStore } from "../store/blogStore";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const articleId = Number(id);

  const article = useBlogStore((state) => state.currentArticle);
  const articleLoading = useBlogStore((state) => state.currentArticleLoading);
  const articleError = useBlogStore((state) => state.currentArticleError);
  const loadArticle = useBlogStore((state) => state.loadArticle);
  const resetCurrentArticle = useBlogStore(
    (state) => state.resetCurrentArticle,
  );

  const comments = useBlogStore((state) => state.comments);
  const commentsLoading = useBlogStore((state) => state.commentsLoading);
  const commentsError = useBlogStore((state) => state.commentsError);
  const loadComments = useBlogStore((state) => state.loadComments);

  const commentSubmitting = useBlogStore((state) => state.commentSubmitting);
  const commentSubmitError = useBlogStore((state) => state.commentSubmitError);
  const submitComment = useBlogStore((state) => state.submitComment);

  useEffect(() => {
    if (!Number.isNaN(articleId)) {
      loadArticle(articleId);
      loadComments(articleId);
    }
    return () => resetCurrentArticle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  if (articleLoading) {
    return <p className="loading-message">Chargement de l'article…</p>;
  }

  if (articleError || !article) {
    return (
      <main className="article-page">
        <p className="error-message">
          {articleError ?? "Article introuvable."}
        </p>
        <Link to="/" className="back-link">
          ← Retour aux articles
        </Link>
      </main>
    );
  }

  return (
    <main className="article-page">
      <Link to="/" className="back-link">
        ← Retour aux articles
      </Link>

      <article>
        <h1>{article.titre}</h1>
        <p className="article-date">{formatDate(article.date)}</p>
        <div className="article-contenu">
          {article.contenu.split("\n").map((paragraphe, index) => (
            <p key={index}>{paragraphe}</p>
          ))}
        </div>
      </article>

      <section className="comments-section">
        <h2>Commentaires</h2>

        {commentsLoading && (
          <p className="loading-message">Chargement des commentaires…</p>
        )}
        {commentsError && <p className="error-message">{commentsError}</p>}
        {!commentsLoading && !commentsError && (
          <CommentList comments={comments} />
        )}

        <CommentForm
          onSubmit={(payload) => submitComment(articleId, payload)}
          isSubmitting={commentSubmitting}
          error={commentSubmitError}
        />
      </section>
    </main>
  );
}

export default ArticlePage;
