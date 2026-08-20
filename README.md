# Blog Java — Spring Boot + React

API REST + back-office admin pour un blog (formation ADA).

![CI](https://github.com/ZoliveAllegret/java_blog/actions/workflows/ci.yml/badge.svg)

## Prérequis

- **Java 21** + Maven Wrapper (`./mvnw`)
- **PostgreSQL** — base `java_blog` ([doc/blog.sql](doc/blog.sql))
- **Node.js 20+** — pour le front React (`admin/`)

## Installation base de données

1. Créer la base `java_blog` dans pgAdmin
2. Exécuter [doc/blog.sql](doc/blog.sql)
3. **Obligatoire avant login admin** : [doc/sql/upgrade-05-01-bcrypt-alice.sql](doc/sql/upgrade-05-01-bcrypt-alice.sql)  
   (`blog.sql` met un placeholder — sans cet upgrade → **401** au login)
4. Tests JUnit : [doc/sql/upgrade-06-01-create-java-blog-test.sql](doc/sql/upgrade-06-01-create-java-blog-test.sql)

Ordre détaillé : [doc/sql/README.md](doc/sql/README.md)

## Démarrage rapide

**Deux terminaux** (API + React) :

```bash
# Terminal 1 — API (port 8080)
./mvnw spring-boot:run

# Terminal 2 — Back-office React (port 5173)
cd admin && npm install && npm run dev
```

| URL | Rôle |
|---|---|
| http://localhost:5173 | Admin React (login + CRUD) |
| http://localhost:8080/ping | Santé API (`pong`) |

Compte admin démo (après upgrade 05) : `alice@example.com` / `demo1234`

### Dépannage rapide

| Symptôme | Cause probable | Action |
|---|---|---|
| `ERR_CONNECTION_REFUSED` sur `:5173` | React arrêté | `cd admin && npm run dev` |
| `Failed to fetch` / liste vide | Spring arrêté | `./mvnw spring-boot:run` |
| **401** au login | Upgrade BCrypt non fait | `doc/sql/upgrade-05-01-bcrypt-alice.sql` |
| **500** à la suppression | FK (commentaires…) | [doc/partie-04-06](doc/partie-04-06-suppression-et-recap.md) § lignes liées |

## Tests

```bash
make test    # PostgreSQL + java_blog_test requis
make ci      # comme GitHub Actions (backend + frontend build)
```

## Documentation

| Document | Description |
|---|---|
| [doc/INDEX.md](doc/INDEX.md) | Parcours de formation (parties 01–07) |
| [doc/annexe-reinstall-propre.md](doc/annexe-reinstall-propre.md) | Réinstall propre — nouveau dossier |
| [doc/API.md](doc/API.md) | Routes HTTP implémentées |
| [doc/blog.sql](doc/blog.sql) | Schéma PostgreSQL + seed |
| [doc/sql/README.md](doc/sql/README.md) | Scripts upgrade par partie |

## Stack

- Backend : Spring Boot 3, JDBC, PostgreSQL, Spring Security, JWT
- Frontend : React (Vite) — `admin/` (CRUD articles + login JWT)

## Branches Git (formation)

| Branche | Contenu |
|---|---|
| `main` | Référence implémentée (backend 02–06 + admin React 04–05) |
| `partie-*` | Étapes pédagogiques (supports dans `doc/`) |
