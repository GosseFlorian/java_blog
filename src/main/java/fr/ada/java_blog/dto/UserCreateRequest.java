package fr.ada.java_blog.dto;

public record UserCreateRequest(
                String pseudo,
                String mail,
                String mdp) {
}