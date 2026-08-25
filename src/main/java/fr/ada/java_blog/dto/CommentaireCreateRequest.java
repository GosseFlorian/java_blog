package fr.ada.java_blog.dto;

public record CommentaireCreateRequest(
        String contenu,
        Integer userId) {
}