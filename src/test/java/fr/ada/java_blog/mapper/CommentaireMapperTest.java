package fr.ada.java_blog.mapper;

import fr.ada.java_blog.dto.CommentaireResponse;
import fr.ada.java_blog.model.Commentaire;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CommentaireMapperTest {

    @Test
    void toResponse_copieIdContenuUserIdEtDate() {
        LocalDateTime date = LocalDateTime.of(2026, 4, 1, 14, 30);

        Commentaire commentaire = new Commentaire(
                10,
                "Bravo !",
                2,
                1,
                date);
        commentaire.setPseudo("alice");

        CommentaireResponse response = CommentaireMapper.toResponse(commentaire);

        assertEquals(10, response.id());
        assertEquals("Bravo !", response.contenu());
        assertEquals(2, response.userId());
        assertEquals("alice", response.pseudo());
        assertEquals(date, response.date());
    }
}