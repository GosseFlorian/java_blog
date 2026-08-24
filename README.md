# Blog Java — Spring Boot + React

API REST + back-office admin pour un blog (formation ADA).

![CI](https://github.com/GosseFlorian/java_blog/actions/workflows/ci.yml/badge.svg)

## Prérequis

- **Java 21** + Maven Wrapper (`./mvnw`)
- **Node.js 20+** (dossier `admin/`)
- **PostgreSQL** — base `java_blog` + upgrades [doc/sql/README.md](sql/README.md)

## Démarrage rapide

**Deux terminaux :**

```bash
# Terminal 1 — API (port 8080)
./mvnw spring-boot:run

# Terminal 2 — Admin React (port 5173)
cd admin && npm install && npm run dev
```
