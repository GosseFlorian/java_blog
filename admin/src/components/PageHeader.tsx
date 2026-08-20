/**
 * PageHeader — bandeau titre du back-office.
 * Props :
 *   - title (string) : texte affiché en gros
 */
interface PageHeaderProps {
  title: string;
}

function PageHeader({ title }: PageHeaderProps) {
  return (
    <header className="page-header">
      <h1>{title}</h1>
    </header>
  );
}

export default PageHeader;
