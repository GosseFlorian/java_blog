# Partie 08 — Étape 04
# Journalisation sécurisée (SLF4J / Logback)

> 📘 **Objectif :** savoir **ce qui se passe** en prod, **sans** exposer mots de passe, tokens ou corps JSON complets.  
> 🗣️ **On vulgarise :** en Node on cite souvent **Pino** ; en Java / Spring Boot, l'équivalent standard c'est **SLF4J** + **Logback** (déjà inclus).

## Ce que tu auras à la fin

- Configuration Logback (`logback-spring.xml`)
- Niveau de log piloté par `LOG_LEVEL` dans `.env`
- Un filtre HTTP qui logue method / path / status / durée — **jamais** le body
- Des logs auth avec mail **masqué**

> ⏱️ **Durée estimée :** 1 h.

---

## Todo

- [ ] Créer `logback-spring.xml`
- [ ] Créer `LogSanitizer` (masquage email, IP)
- [ ] Créer `RequestAuditFilter` (filtre OncePerRequestFilter)
- [ ] Ajouter des logs dans `AuthController` et `JwtAuthFilter`
- [ ] Tester avec `LOG_LEVEL=INFO` puis `DEBUG` dans `.env`
- [ ] Commit `08-04 — journalisation sécurisée`

---

## 1. Règles du projet (OWASP A09)

| ✅ On logue | ❌ On ne logue jamais |
|-------------|----------------------|
| Méthode HTTP, path, status code | `req.body` complet |
| Durée en ms | Token JWT (`Authorization`) |
| userId après login OK | Mot de passe ou hash BCrypt |
| Mail masqué (`a***@example.com`) | Secret JWT |

---

## 2. `logback-spring.xml`

**Chemin :** `src/main/resources/logback-spring.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>

    <springProperty name="LOG_LEVEL" source="logging.level.root" defaultValue="INFO"/>

    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <logger name="fr.ada.java_blog" level="${LOG_LEVEL}"/>
    <root level="${LOG_LEVEL}">
        <appender-ref ref="CONSOLE"/>
    </root>
</configuration>
```

Dans `application.yaml` (déjà prévu en 08-02) :

```yaml
logging:
  level:
    root: ${LOG_LEVEL:INFO}
```

---

## 3. Classe `LogSanitizer`

**Chemin :** `src/main/java/fr/ada/java_blog/util/LogSanitizer.java`

Méthodes suggérées :

- `maskEmail(String mail)` → `a***@example.com`
- `maskIp(String ip)` → `127.0.0.xxx`
- `sanitizePath(String path)` → retire `\r` / `\n`

---

## 4. Filtre `RequestAuditFilter`

**Chemin :** `src/main/java/fr/ada/java_blog/config/RequestAuditFilter.java`

Étapes :

1. Étendre `OncePerRequestFilter`
2. Avant `filterChain.doFilter`, mémoriser `System.currentTimeMillis()`
3. Après la requête : loguer `method`, `path`, `status`, `durationMs`, `ip` masquée
4. Niveau **WARN** si status ≥ 400, **DEBUG** sinon

Enregistre le filtre dans `SecurityConfig` **avant** `JwtAuthFilter` :

```java
.addFilterBefore(requestAuditFilter, UsernamePasswordAuthenticationFilter.class)
```

---

## 5. Logs dans `AuthController`

```java
private static final Logger log = LoggerFactory.getLogger(AuthController.class);

// Échec login :
log.warn("Échec login (mail={})", LogSanitizer.maskEmail(body.mail()));

// Succès :
log.info("Login réussi (userId={}, mail={})", user.getId(), LogSanitizer.maskEmail(body.mail()));
```

> ⚠️ **Jamais** `body.mdp()` dans un log.

---

## 6. `JwtAuthFilter`

En cas de token invalide :

```java
log.warn("JWT invalide (path={})", LogSanitizer.sanitizePath(request.getRequestURI()));
// pas de log du token !
```

---

## 7. Vérifications

```bash
./mvnw spring-boot:run
# Login raté → log WARN avec mail masqué
# Login OK → log INFO userId + mail masqué
# GET /articles/99999 → WARN HTTP GET … 404
./mvnw test    # toujours vert
```

---

## Commit Git

```bash
git add src/main/resources/logback-spring.xml \
  src/main/java/fr/ada/java_blog/util/LogSanitizer.java \
  src/main/java/fr/ada/java_blog/config/RequestAuditFilter.java \
  src/main/java/fr/ada/java_blog/config/SecurityConfig.java \
  src/main/java/fr/ada/java_blog/controller/AuthController.java \
  src/main/java/fr/ada/java_blog/config/JwtAuthFilter.java
git commit -m "08-04 — journalisation sécurisée SLF4J"
```

👉 **[partie-08-05-securite-owasp.md](partie-08-05-securite-owasp.md)**
