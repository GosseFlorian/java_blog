import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "../../store/authStore";

describe("authStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      pseudo: null,
      userId: null,
      loginError: null,
      isLoggingIn: false,
      isAuthenticated: false,
    });
  });

  it("isAuthenticated est false par défaut après reset", () => {
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("clearLoginError efface loginError", () => {
    useAuthStore.setState({ loginError: "Erreur test" });
    useAuthStore.getState().clearLoginError();
    expect(useAuthStore.getState().loginError).toBeNull();
  });
});
