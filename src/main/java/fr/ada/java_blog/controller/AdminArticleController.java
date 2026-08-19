package fr.ada.java_blog.controller;

import fr.ada.java_blog.dto.ArticleCreateRequest;
import fr.ada.java_blog.dto.ArticleResponse;
import fr.ada.java_blog.dto.ArticleUpdateRequest;
import fr.ada.java_blog.mapper.ArticleMapper;
import fr.ada.java_blog.model.Article;
import fr.ada.java_blog.repository.ArticleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/admin/articles")
public class AdminArticleController {

    private final ArticleRepository articleRepository;

    public AdminArticleController(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    @PostMapping
    public ResponseEntity<ArticleResponse> creer(@RequestBody ArticleCreateRequest body) {
        LocalDateTime maintenant = LocalDateTime.now();
        Article article = new Article(
                null, body.titre(), body.contenu(),
                false, maintenant, maintenant, body.userId()
        );
        Article sauve = articleRepository.save(article);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ArticleMapper.toResponse(sauve));
    }

    @PutMapping("/{id}")
    public ArticleResponse modifier(@PathVariable int id, @RequestBody ArticleUpdateRequest body) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Article introuvable"));

        article.setTitre(body.titre());
        article.setContenu(body.contenu());
        article.setPublie(body.publie());
        article.setUpdate(LocalDateTime.now());

        if (!articleRepository.update(id, article)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Article introuvable");
        }
        return ArticleMapper.toResponse(article);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimer(@PathVariable int id) {
        if (!articleRepository.deleteById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Article introuvable");
        }
        return ResponseEntity.noContent().build();
    }
}
