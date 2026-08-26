package fr.ada.java_blog.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class CommentaireControllerMockMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getCommentaires_articleExistant_retourne200() throws Exception {
        mockMvc.perform(get("/articles/1/commentaires"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$", hasSize(org.hamcrest.Matchers.greaterThanOrEqualTo(1))));
    }

    @Test
    void getCommentaires_articleInexistant_retourne404() throws Exception {
        mockMvc.perform(get("/articles/99999/commentaires"))
                .andExpect(status().isNotFound());
    }

    @Test
    void postCommentaire_articleExistant_retourne201() throws Exception {
        String body = """
                {"contenu":"Via MockMvc","userId":1}
                """;

        mockMvc.perform(post("/articles/1/commentaires")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.contenu").value("Via MockMvc"))
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    void postCommentaire_articleInexistant_retourne404() throws Exception {
        String body = """
                {"contenu":"Orphelin","userId":1}
                """;

        mockMvc.perform(post("/articles/99999/commentaires")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isNotFound());
    }
}