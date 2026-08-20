# Blog Java — Partie 03 (API backend)

> Branche **`partie-03`** : Spring Boot + PostgreSQL + CRUD articles **sans** front React.  
> Prochaine étape : [doc/partie-04-01-cadrage-react-composants.md](doc/partie-04-01-cadrage-react-composants.md)

## Prérequis

- **Java 21** + Maven Wrapper (`./mvnw`)
- **PostgreSQL** — base **`java_blog`** ([doc/blog.sql](doc/blog.sql), installée en partie 02)
- **Node.js 20+** — requis à partir de la **partie 04** (Vite)

> ⚠️ Ne pas checkout **`main`** pour suivre le cours : cette branche contient déjà l'admin React et l'auth JWT.

## Clone et branche

```bash
git clone https://github.com/ZoliveAllegret/java_blog.git
cd java_blog
git checkout partie-03
```

## Démarrage (backend seul)

```bash
./mvnw spring-boot:run
```

| URL | Rôle |
|---|---|
| http://localhost:8080/ping | Santé API |
| http://localhost:8080/db/ping | Connexion PostgreSQL |
| http://localhost:8080/articles/recents | 5 derniers articles (JSON) |
| http://localhost:8080/admin/articles | CRUD admin (ouvert — auth en partie 05) |

Pas de dossier **`admin/`** sur cette branche : c'est **normal**.

## Partie 04 — créer le React

```bash
git checkout -b partie-04
```

Puis suivre [doc/partie-04-02-setup-react-vite.md](doc/partie-04-02-setup-react-vite.md) (création de `admin/` + CORS si besoin).

## Documentation

| Document | Description |
|---|---|
| [doc/INDEX.md](doc/INDEX.md) | Parcours parties 01–07 |
| [doc/partie-04-01-cadrage-react-composants.md](doc/partie-04-01-cadrage-react-composants.md) | **Commencer la partie 04** |
| [doc/blog.sql](doc/blog.sql) | Schéma PostgreSQL + seed |

## Branches Git (formation)

| Branche | Contenu |
|---|---|
| `partie-03` | **Tu es ici** — API articles complète, sans React |
| `partie-04` | Branche **locale** élève — admin React (à créer depuis `partie-03`) |
| `main` | Référence formateur — projet complet |
