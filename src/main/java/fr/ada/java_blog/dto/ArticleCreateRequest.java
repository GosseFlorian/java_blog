package fr.ada.java_blog.dto;

public record ArticleCreateRequest(
        String titre,
        String contenu,
        Integer userId
) {}
