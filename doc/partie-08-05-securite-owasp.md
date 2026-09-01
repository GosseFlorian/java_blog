# Partie 08 — Étape 05
# Sécurité OWASP Top 10 (extrait appliqué)

> 📘 **Objectif :** renforcer le blog sur les risques les plus fréquents — **par la pratique**.  
> 🗣️ **On vulgarise :** OWASP Top 10 = la **hit parade** des failles web ; tu n'as pas besoin de tout connaître par cœur, mais de **montrer des mesures concrètes** dans ton projet.

## Ce que tu auras à la fin

- Validation des entrées (`@Valid` + Bean Validation)
- Headers de sécurité (CSP, X-Frame-Options, …)
- CORS configuré via `.env`
- Protection XSS basique sur les commentaires
- Rate limit sur `/auth/login`
- Gestion d'erreurs sans fuite de stack trace

> ⏱️ **Durée estimée :** 2 h à 3 h.

---

## Todo

- [ ] Ajouter `spring-boot-starter-validation` dans `pom.xml`
- [ ] Annoter les DTOs sensibles (`LoginRequest`, `RegisterRequest`, commentaires…)
- [ ] Créer `GlobalExceptionHandler`
- [ ] Renforcer `SecurityConfig` (headers)
- [ ] Créer `InputSanitizer` + l'utiliser dans `CommentaireController`
- [ ] Créer `LoginRateLimitFilter` (désactivé en profil `test`)
- [ ] Documenter les mesures dans `docs/README-architecture.md` (étape 08-06)
- [ ] Commit `08-05 — sécurité OWASP`

---

## 1. A01 — Contrôle d'accès (IDOR)

**Déjà en place** sur les commentaires : `verifierUserIdCorrespondAuToken` dans `CommentaireController`.

**À vérifier toi-même :**

- PATCH / DELETE `/commentaires/{id}` avec le token d'un **autre** user → **403**
- Routes `/admin/**` sans JWT → **401**

**Exercice oral CDA :** explique au jury *pourquoi* Spring Security seul ne suffit pas pour l'IDOR sur les commentaires.

---

## 2. A03 — Injection SQL et XSS

### SQL

Tes repositories utilisent déjà `JdbcTemplate` avec `?` — **ne change pas** pour concaténer des strings.

**Test mental :** montre une requête avec `?` dans `ArticleRepository`.

### XSS

1. Crée `InputSanitizer` :
   - `stripDangerousHtml(contenu)` — retire `<script>`, `onclick=`, etc.
   - `looksLikeSqlInjection(contenu)` — patterns `--`, `';`, `DROP TABLE`
2. Appelle-le dans `CommentaireController` avant `save` / `update`
3. React échappe déjà le HTML — la couche API protège les autres clients

---

## 3. A05 — Mauvaise configuration

### Headers dans `SecurityConfig`

```java
.headers(headers -> headers
    .contentSecurityPolicy(csp -> csp.policyDirectives(
        "default-src 'self'; frame-ancestors 'none'; form-action 'self'"))
    .frameOptions(frame -> frame.deny())
    .contentTypeOptions(Customizer.withDefaults())
    .referrerPolicy(referrer -> referrer.policy(
        ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN)))
```

### CORS

Origines lues depuis `${cors.allowed-origins}` — **pas** `allowedHeaders("*")` en prod si tu peux limiter à `Authorization`, `Content-Type`.

### Secrets

Déjà traité en 08-02 (`.env`).

---

## 4. A07 — Authentification

| Mesure | Comment |
|--------|---------|
| BCrypt | Déjà en place (`PasswordEncoder`) |
| Message login unique | « Identifiants invalides » — ne dis pas « mail inconnu » |
| Validation mot de passe | `@Size(min = 8)` sur `LoginRequest` / `RegisterRequest` |
| Rate limit login | Filtre : max 10 POST `/auth/login` / 5 min / IP |

**Profil test** — dans `application-test.yaml` :

```yaml
security:
  login-rate-limit:
    enabled: false
```

Sinon `./mvnw test` échoue (trop de logins depuis la même IP).

---

## 5. Bean Validation

**Dépendance :**

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

**Exemple `LoginRequest` :**

```java
public record LoginRequest(
    @NotBlank @Email String mail,
    @NotBlank @Size(min = 8, max = 128) String mdp
) {}
```

**Controller :**

```java
public LoginResponse login(@Valid @RequestBody LoginRequest body)
```

**`GlobalExceptionHandler`** — renvoie 400 + liste des champs invalides, 500 générique sans stack trace.

---

## 6. A09 — Journalisation

Voir [partie-08-04-journalisation-securisee.md](partie-08-04-journalisation-securisee.md).

---

## 7. Tests à adapter

| Test | Modification |
|------|--------------|
| `AuthControllerMockMvcTest` | Mot de passe incorrect ≥ 8 caractères (`wrongpass`) sinon 400 au lieu de 401 |
| Tous les tests login | Rate limit **off** en profil `test` |

```bash
./mvnw test
```

---

## Commit Git

```bash
git add pom.xml src/main/java/fr/ada/java_blog/config/ src/main/java/fr/ada/java_blog/dto/ \
  src/main/java/fr/ada/java_blog/controller/ src/main/java/fr/ada/java_blog/util/ \
  src/test/resources/application-test.yaml \
  src/test/java/fr/ada/java_blog/controller/AuthControllerMockMvcTest.java
git commit -m "08-05 — sécurité OWASP (validation, headers, rate limit)"
```

👉 **[partie-08-06-documentation-diataxis.md](partie-08-06-documentation-diataxis.md)**
