import { describe, it, expect, beforeEach } from "vitest";
import { getToken, logout, isLoggedIn, getAuthHeaders } from "../../api/auth";

describe("auth.ts", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("isLoggedIn retourne false sans token", () => {
    expect(isLoggedIn()).toBe(false);
  });

  it("getAuthHeaders retourne Authorization si token présent", () => {
    localStorage.setItem("java_blog_token", "fake-jwt");

    expect(getAuthHeaders()).toEqual({
      Authorization: "Bearer fake-jwt",
    });
  });

  it("logout efface le token", () => {
    localStorage.setItem("java_blog_token", "x");

    logout();

    expect(getToken()).toBeNull();
  });
});
