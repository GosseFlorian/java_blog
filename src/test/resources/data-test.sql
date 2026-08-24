-- Hash BCrypt de "demo1234" (même qu'en partie 05)
INSERT INTO users (id, pseudo, mail, mdp) VALUES
(1, 'alice_dev', 'alice@example.com', '$2y$10$dogkYyhsfVKlpjKpyhRUkecSPVCJA3D5yUSvj4L050OGVolNJUuG6');

INSERT INTO articles (id, titre, contenu, statut, date, "update", user_id) VALUES
(1, 'Article test CI', 'Contenu pour JUnit', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
(2, 'Brouillon test', 'Non publié', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1);

SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users));
SELECT setval(pg_get_serial_sequence('articles', 'id'), (SELECT MAX(id) FROM articles));