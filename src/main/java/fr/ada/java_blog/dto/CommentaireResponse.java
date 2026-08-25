package fr.ada.java_blog.dto;

import java.time.LocalDateTime;

public record CommentaireResponse(
        Integer id,
        String contenu,
        Integer userId,
        LocalDateTime date) {
}
