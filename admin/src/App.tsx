import PageHeader from "./components/PageHeader.tsx";
import ArticleList from "./components/ArticleList.tsx";
import { articlesSample } from "./data/articleSample.ts";
import "./App.css";

/**
 * App — racine du back-office.
 * Rôle : posséder les données (ici en dur) et passer des props aux enfants.
 */
function App() {
  // Données en dur — étape 04 : viendront de l'API
  const articles = articlesSample;

  // Callbacks — étape 05/06 : ouvrir formulaire ou appeler DELETE
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
        <ArticleList
          articles={articles}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}

export default App;
