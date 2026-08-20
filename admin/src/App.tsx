import { useEffect, useState } from "react";
import PageHeader from "./components/PageHeader.tsx";
import ArticleList from "./components/ArticleList.tsx";
import LoadingMessage from "./components/LoadingMessage.tsx";
import { fetchRecentArticles } from "./api/articles.ts";
import type { Article } from "./data/articleSample.ts";
import "./App.css";

/**
 * App — racine du back-office.
 * Rôle : charger les articles (API), gérer loading/erreur, passer des props aux enfants.
 */
function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArticles() {
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
    }

    loadArticles();
  }, []);

  function handleEdit(id: number) {
    console.log("Modifier l'article id =", id);
  }

  function handleDelete(id: number) {
    console.log("Supprimer l'article id =", id);
  }

  return (
    <div className="app">
      <PageHeader title="Back-office — Blog Java" />

      <main>
        {isLoading && <LoadingMessage />}

        {error && <p className="error-message">{error}</p>}

        {!isLoading && !error && (
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
