package fr.ada.java_blog.dto;

public record RegisterRequest(
        String pseudo,
        String mail,
        String mdp) {
}
