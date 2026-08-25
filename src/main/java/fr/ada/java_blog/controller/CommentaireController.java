package fr.ada.java_blog.controller;

import fr.ada.java_blog.dto.CommentaireCreateRequest;
import fr.ada.java_blog.dto.CommentaireResponse;
import fr.ada.java_blog.dto.CommentaireUpdateRequest;
import fr.ada.java_blog.mapper.CommentaireMapper;
import fr.ada.java_blog.repository.ArticleRepository;
import fr.ada.java_blog.repository.CommentaireRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
public class CommentaireController {

    private final CommentaireRepository commentaireRepository;
    private final ArticleRepository articleRepository;

    public CommentaireController(CommentaireRepository commentaireRepository,
            ArticleRepository articleRepository) {
        this.commentaireRepository = commentaireRepository;
        this.articleRepository = articleRepository;
    }

    @GetMapping("/articles/{articleId}/commentaires")
    public List<CommentaireResponse> list(@PathVariable int articleId) {
        verifierArticleExiste(articleId);
        return commentaireRepository.findByArticleId(articleId).stream()
                .map(CommentaireMapper::toResponse)
                .toList();
    }

    @PostMapping("/articles/{articleId}/commentaires")
    public ResponseEntity<CommentaireResponse> create(
            @PathVariable int articleId,
            @RequestBody CommentaireCreateRequest body) {
        verifierArticleExiste(articleId);
        var saved = commentaireRepository.save(articleId, body.contenu(), body.userId());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(CommentaireMapper.toResponse(saved));
    }

    @GetMapping("/commentaires/{id}")
    public CommentaireResponse one(@PathVariable int id) {
        return commentaireRepository.findById(id)
                .map(CommentaireMapper::toResponse)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Commentaire introuvable"));
    }

    @PatchMapping("/commentaires/{id}")
    public CommentaireResponse update(@PathVariable int id, @RequestBody CommentaireUpdateRequest body) {
        if (!commentaireRepository.updateById(id, body.contenu())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Commentaire introuvable");
        }

        var commentaire = commentaireRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Commentaire introuvable"));

        return CommentaireMapper.toResponse(commentaire);
    }

    private void verifierArticleExiste(int articleId) {
        articleRepository.findById(articleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article introuvable"));
    }

}