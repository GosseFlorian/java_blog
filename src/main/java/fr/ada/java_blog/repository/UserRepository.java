package fr.ada.java_blog.repository;

import fr.ada.java_blog.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    private static final RowMapper<User> USER_ROW_MAPPER = (rs, rowNum) -> new User(
            rs.getInt("id"),
            rs.getString("pseudo"),
            rs.getString("mail"),
            rs.getString("mdp"));

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<User> findById(int id) {
        List<User> user = jdbcTemplate.query(
                """
                        SELECT id, pseudo, mail, mdp
                        FROM users
                        WHERE id = ?
                        """,
                USER_ROW_MAPPER,
                id);
        return user.stream().findFirst();
    }

    public List<User> findAll() {
        return jdbcTemplate.query(
                """
                        SELECT id, pseudo, mail, mdp
                        FROM users
                        ORDER BY pseudo ASC
                        """,
                USER_ROW_MAPPER);
    }

    public User save(User user) {
        Integer id = jdbcTemplate.queryForObject(
                """
                        INSERT INTO users (pseudo, mail, mdp)
                        VALUES (?, ?, ?)
                        RETURNING id
                        """,
                Integer.class,
                user.getPseudo(),
                user.getMail(),
                user.getMdp());
        user.setId(id);
        return user;
    }

    public boolean updateById(int id, User user) {
        int rows = jdbcTemplate.update(
                """
                        UPDATE users
                        SET pseudo = ?, mail = ?, mdp = ?
                        WHERE id = ?
                        """,
                user.getPseudo(),
                user.getMail(),
                user.getMdp(),
                id);
        return rows > 0;
    }

    public boolean deleteById(int id) {
        int rows = jdbcTemplate.update(
                """
                        DELETE FROM users
                        WHERE id = ?
                        """,
                id);
        return rows > 0;
    }

    /**
     * Trouve un user par mail (login).
     * 
     * @return Optional vide si aucun compte avec ce mail
     */
    public Optional<User> findByMail(String mail) {
        String sql = """
                SELECT id, pseudo, mail, mdp
                FROM "users"
                WHERE mail = ?
                """;

        return jdbcTemplate.query(sql, USER_ROW_MAPPER, mail).stream().findFirst();
    }
}