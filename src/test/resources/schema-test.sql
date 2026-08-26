DROP TABLE IF EXISTS commentaires CASCADE;
DROP TABLE IF EXISTS articles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    pseudo VARCHAR(255),
    mail VARCHAR(255),
    mdp VARCHAR(255)
);

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255),
    contenu TEXT,
    statut BOOLEAN,
    date TIMESTAMP,
    "update" TIMESTAMP,
    user_id INT
);

CREATE TABLE commentaires (
    id SERIAL PRIMARY KEY,
    contenu TEXT,
    user_id INT,
    article_id INT,
    date TIMESTAMP
);