package fr.ada.java_blog.dto;

public record UserUpdateRequest(
                String pseudo,
                String mail,
                String mdp) {
}