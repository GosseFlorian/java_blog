import { useEffect } from 'react';
import PageHeader from './components/PageHeader.tsx';
import AdminNav from './components/AdminNav.tsx';
import FeedbackMessage from './components/FeedbackMessage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import ArticlesPage from './pages/ArticlesPage.tsx';
import CategoriesPage from './pages/CategoriesPage.tsx';
import UsersPage from './pages/UsersPage.tsx';
import { useAuthStore } from './store/authStore.ts';
import { useAdminStore } from './store/adminStore.ts';
import './App.css';

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const pseudo = useAuthStore((s) => s.pseudo);
  const logout = useAuthStore((s) => s.logout);
  const section = useAdminStore((s) => s.section);
  const feedback = useAdminStore((s) => s.feedback);
  const setSection = useAdminStore((s) => s.setSection);
  const loadCurrentSection = useAdminStore((s) => s.loadCurrentSection);
  const clearFeedback = useAdminStore((s) => s.clearFeedback);
  const reset = useAdminStore((s) => s.reset);

  useEffect(() => {
    if (isAuthenticated) {
      loadCurrentSection();
    }
  }, [isAuthenticated, section, loadCurrentSection]);

  function handleLogout() {
    logout();
    reset();
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="app">
      <PageHeader title="Back-office — Blog Java" pseudo={pseudo} onLogout={handleLogout} />

      <AdminNav active={section} onChange={setSection} />

      <main>
        {feedback && (
          <FeedbackMessage
            type={feedback.type}
            message={feedback.message}
            onClose={clearFeedback}
          />
        )}

        {section === 'articles' && <ArticlesPage />}
        {section === 'categories' && <CategoriesPage />}
        {section === 'users' && <UsersPage />}
      </main>
    </div>
  );
}

export default App;
