package fr.ada.java_blog.service;

import fr.ada.java_blog.model.User;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
class JwtServiceTest {

    @Autowired
    private JwtService jwtService;

    @Test
    void generateToken_puisParse_retourneLesClaims() {
        User user = new User(1, "alice_dev", "alice@example.com", "hash");

        String token = jwtService.generateToken(user);
        Claims claims = jwtService.parseToken(token);

        assertEquals("1", claims.getSubject());
        assertEquals("alice_dev", claims.get("pseudo", String.class));
        assertEquals(1, jwtService.extractUserId(claims));
    }

    @Test
    void parseToken_invalide_lanceException() {
        assertThrows(Exception.class, () -> jwtService.parseToken("token.bidon"));
    }

    @Test
    void generateToken_nonVide() {
        User user = new User(2, "bob", "bob@example.com", "hash");
        assertNotNull(jwtService.generateToken(user));
    }
}
