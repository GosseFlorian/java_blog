package fr.ada.java_blog.dto;

public record ArticleUpdateRequest(
        String titre,
        String contenu,
        boolean publie
) {}
