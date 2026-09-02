interface PageHeaderProps {
  title: string;
  pseudo?: string | null;
  onLogout?: () => void;
}

function PageHeader({ title, pseudo, onLogout }: PageHeaderProps) {
  return (
    <header className="page-header">
      <h1>{title}</h1>
      {pseudo != null && onLogout && (
        <p className="header-auth">
          <span>
            Connecté : <strong>{pseudo}</strong>
          </span>
          <button type="button" onClick={onLogout}>
            Déconnexion
          </button>
        </p>
      )}
    </header>
  );
}

export default PageHeader;
