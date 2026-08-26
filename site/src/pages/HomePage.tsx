import { useEffect } from "react";
import { useBlogStore } from "../store/blogStore";
import ArticleList from "../components/ArticleList";

function HomePage() {
  const articles = useBlogStore((state) => state.articles);
  const loading = useBlogStore((state) => state.articlesLoading);
  const error = useBlogStore((state) => state.articlesError);
  const loadArticles = useBlogStore((state) => state.loadArticles);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  return (
    <main className="home-page">
      <h1>Le blog</h1>

      {loading && <p className="loading-message">Chargement des articles…</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && <ArticleList articles={articles} />}
    </main>
  );
}

export default HomePage;
