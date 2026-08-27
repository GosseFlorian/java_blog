package fr.ada.java_blog.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerMockMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void login_identifiantsValides_retourneToken() throws Exception {
        String body = """
                {"mail":"alice@example.com","mdp":"demo1234"}
                """;

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.pseudo").value("alice_dev"))
                .andExpect(jsonPath("$.userId").value(1));
    }

    @Test
    void login_motDePasseIncorrect_retourne401() throws Exception {
        String body = """
                {"mail":"alice@example.com","mdp":"wrong"}
                """;

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void register_nouveauMail_creeUnCompteEtRetourneToken() throws Exception {
        String body = """
                {"pseudo":"nouveau_visiteur","mail":"nouveau@example.com","mdp":"motdepasse"}
                """;

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.pseudo").value("nouveau_visiteur"))
                .andExpect(jsonPath("$.userId").isNotEmpty());
    }

    @Test
    void register_mailDejaUtilise_retourne409() throws Exception {
        String body = """
                {"pseudo":"alice_bis","mail":"alice@example.com","mdp":"autremdp"}
                """;

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isConflict());
    }
}