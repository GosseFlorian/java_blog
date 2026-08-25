package fr.ada.java_blog.repository;

import fr.ada.java_blog.model.Commentaire;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class CommentaireRepository {

    private final JdbcTemplate jdbcTemplate;

    private static final RowMapper<Commentaire> ROW_MAPPER = (rs, rowNum) -> new Commentaire(
            rs.getInt("id"),
            rs.getString("contenu"),
            rs.getObject("user_id", Integer.class),
            rs.getObject("article_id", Integer.class),
            rs.getTimestamp("date").toLocalDateTime());

    public CommentaireRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Commentaire> findByArticleId(int articleId) {
        String sql = """
                SELECT id, contenu, user_id, article_id, date
                FROM commentaires
                WHERE article_id = ?
                ORDER BY date DESC
                """;
        return jdbcTemplate.query(sql, ROW_MAPPER, articleId);
    }

    public Optional<Commentaire> findById(int id) {
        String sql = """
                SELECT id, contenu, user_id, article_id, date
                FROM commentaires WHERE id = ?
                """;
        return jdbcTemplate.query(sql, ROW_MAPPER, id).stream().findFirst();
    }

    public List<Commentaire> findAll() {
        String sql = """
                SELECT id, contenu, user_id, article_id, date
                FROM commentaires
                ORDER BY date ASC
                """;
        return jdbcTemplate.query(sql, ROW_MAPPER);
    }

    public Commentaire save(int articleId, String contenu, int userId) {
        String sql = """
                INSERT INTO commentaires (contenu, user_id, article_id, date)
                VALUES (?, ?, ?, ?)
                RETURNING id, contenu, user_id, article_id, date
                """;
        LocalDateTime now = LocalDateTime.now();
        return jdbcTemplate.queryForObject(sql, ROW_MAPPER, contenu, userId, articleId, now);
    }

    public boolean updateById(int id, String contenu) {
        String sql = """
                UPDATE commentaires
                SET contenu = ?
                WHERE id = ?
                """;
        return jdbcTemplate.update(sql, contenu, id) > 0;
    }

    public boolean deleteById(int id) {
        return jdbcTemplate.update("DELETE FROM commentaires WHERE id = ?", id) > 0;
    }
}
