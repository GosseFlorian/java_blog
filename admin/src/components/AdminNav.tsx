export type AdminSection = "articles" | "categories" | "users";

interface AdminNavProps {
  active: AdminSection;
  onChange: (section: AdminSection) => void;
}

function AdminNav({ active, onChange }: AdminNavProps) {
  const links: { id: AdminSection; label: string }[] = [
    { id: "articles", label: "Articles" },
    { id: "categories", label: "Catégories" },
    { id: "users", label: "Utilisateurs" },
  ];

  return (
    <nav className="admin-nav" aria-label="Sections du back-office">
      {links.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={active === id ? "admin-nav-link active" : "admin-nav-link"}
          aria-current={active === id ? "page" : undefined}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

export default AdminNav;
