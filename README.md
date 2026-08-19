# Blog Java — Spring Boot + React

API REST + back-office admin pour un blog (formation ADA).

![CI](https://github.com/USER/REPO/actions/workflows/ci.yml/badge.svg)

## Prérequis

- **Java 21** + Maven Wrapper (`./mvnw`)
- **PostgreSQL** — base `java_blog` ([doc/blog.sql](doc/blog.sql))
- **Node.js 20+** — pour le front React (`admin/`, à venir)

## Installation base de données

1. Créer la base `java_blog` dans pgAdmin
2. Exécuter [doc/blog.sql](doc/blog.sql)
3. Partie auth : [doc/sql/upgrade-05-01-bcrypt-alice.sql](doc/sql/upgrade-05-01-bcrypt-alice.sql)
4. Tests : [doc/sql/upgrade-06-01-create-java-blog-test.sql](doc/sql/upgrade-06-01-create-java-blog-test.sql)

## Démarrage rapide

```bash
# API (port 8080)
./mvnw spring-boot:run
```

Compte admin démo (après upgrade 05) : `alice@example.com` / `demo1234`

## Tests

```bash
make test    # PostgreSQL + java_blog_test requis
make ci      # comme GitHub Actions (backend)
```

## Documentation

| Document | Description |
|---|---|
| [doc/INDEX.md](doc/INDEX.md) | Parcours de formation (parties 01–07) |
| [doc/API.md](doc/API.md) | Routes HTTP implémentées |
| [doc/blog.sql](doc/blog.sql) | Schéma PostgreSQL + seed |
| [doc/sql/README.md](doc/sql/README.md) | Scripts upgrade par partie |

## Stack

- Backend : Spring Boot 3, JDBC, PostgreSQL, Spring Security, JWT
- Frontend : React (Vite) — `admin/` *(à venir)*

## Branches Git (formation)

| Branche | Contenu |
|---|---|
| `main` | Référence implémentée (backend parties 02–06) |
| `partie-*` | Étapes pédagogiques (supports dans `doc/`) |
