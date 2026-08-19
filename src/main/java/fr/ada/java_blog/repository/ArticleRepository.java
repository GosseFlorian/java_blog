package fr.ada.java_blog.repository;

import fr.ada.java_blog.model.Article;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class ArticleRepository {

    private static final RowMapper<Article> ROW_MAPPER = (rs, rowNum) -> {
        Timestamp dateTs = rs.getTimestamp("date");
        Timestamp updateTs = rs.getTimestamp("update");
        Integer userId = rs.getObject("user_id", Integer.class);
        return new Article(
                rs.getInt("id"),
                rs.getString("titre"),
                rs.getString("contenu"),
                rs.getBoolean("statut"),
                dateTs != null ? dateTs.toLocalDateTime() : null,
                updateTs != null ? updateTs.toLocalDateTime() : null,
                userId
        );
    };

    private final JdbcTemplate jdbcTemplate;

    public ArticleRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Article> findRecents(int limit) {
        return jdbcTemplate.query(
                """
                SELECT id, titre, contenu, statut, date, "update", user_id
                FROM articles
                ORDER BY date DESC, id DESC
                LIMIT ?
                """,
                ROW_MAPPER,
                limit
        );
    }

    public int countRecents(int limit) {
        Integer count = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*)
                FROM (
                    SELECT 1 FROM articles
                    ORDER BY date DESC, id DESC
                    LIMIT ?
                ) AS recents
                """,
                Integer.class,
                limit
        );
        return count != null ? count : 0;
    }

    public List<Article> findPublies() {
        return jdbcTemplate.query(
                """
                SELECT id, titre, contenu, statut, date, "update", user_id
                FROM articles
                WHERE statut = true
                ORDER BY date DESC, id DESC
                """,
                ROW_MAPPER
        );
    }

    public Optional<Article> findById(int id) {
        List<Article> articles = jdbcTemplate.query(
                """
                SELECT id, titre, contenu, statut, date, "update", user_id
                FROM articles
                WHERE id = ?
                """,
                ROW_MAPPER,
                id
        );
        return articles.stream().findFirst();
    }

    public Article save(Article article) {
        Integer id = jdbcTemplate.queryForObject(
                """
                INSERT INTO articles (titre, contenu, date, statut, "update", user_id)
                VALUES (?, ?, ?, ?, ?, ?)
                RETURNING id
                """,
                Integer.class,
                article.getTitre(),
                article.getContenu(),
                toTimestamp(article.getDate()),
                article.isPublie(),
                toTimestamp(article.getUpdate()),
                article.getUserId()
        );
        article.setId(id);
        return article;
    }

    public boolean update(int id, Article article) {
        int rows = jdbcTemplate.update(
                """
                UPDATE articles
                SET titre = ?, contenu = ?, statut = ?, "update" = ?
                WHERE id = ?
                """,
                article.getTitre(),
                article.getContenu(),
                article.isPublie(),
                toTimestamp(article.getUpdate()),
                id
        );
        return rows > 0;
    }

    public boolean deleteById(int id) {
        int rows = jdbcTemplate.update("DELETE FROM articles WHERE id = ?", id);
        return rows > 0;
    }

    private static Timestamp toTimestamp(LocalDateTime value) {
        return value != null ? Timestamp.valueOf(value) : null;
    }
}
