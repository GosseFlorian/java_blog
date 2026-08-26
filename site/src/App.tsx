import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ArticlePage from "./pages/ArticlePage";
import "./App.css";

function App() {
  return (
    <div className="site">
      <header className="site-header">
        <Link to="/" className="site-title">
          Blog Java
        </Link>
      </header>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles/:id" element={<ArticlePage />} />
      </Routes>
    </div>
  );
}

export default App;
