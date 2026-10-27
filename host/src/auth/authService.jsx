const KEYCLOAK_URL = "http://localhost:8082";
const REALM = "healthcare";
const CLIENT_ID = "healthcare-portal";

const TOKEN_URL =
  `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;

class AuthService {

  async login(username, password) {
    const params = new URLSearchParams();

    params.append("client_id", CLIENT_ID);
    params.append("grant_type", "password");
    params.append("username", username);
    params.append("password", password);

    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));

      throw new Error(
        error.error_description || "Invalid username or password"
      );
    }

    const tokens = await response.json();

    this.saveTokens(tokens);

    return tokens;
  }

  saveTokens(tokens) {
    sessionStorage.setItem("access_token", tokens.access_token);
    sessionStorage.setItem("refresh_token", tokens.refresh_token);

    if (tokens.expires_in) {
      sessionStorage.setItem(
        "expires_at",
        Date.now() + tokens.expires_in * 1000
      );
    }
  }

  getAccessToken() {
    return sessionStorage.getItem("access_token");
  }

  getRefreshToken() {
    return sessionStorage.getItem("refresh_token");
  }

  isLoggedIn() {
    return !!this.getAccessToken();
  }

  async refreshToken() {

    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      this.logout();
      throw new Error("No refresh token");
    }

    const params = new URLSearchParams();

    params.append("client_id", CLIENT_ID);
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refreshToken);

    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params
    });

    if (!response.ok) {
      this.logout();
      throw new Error("Session expired");
    }

    const tokens = await response.json();

    this.saveTokens(tokens);

    return tokens.access_token;
  }

  async getValidToken() {

    const expiresAt =
      Number(sessionStorage.getItem("expires_at") || 0);

    const now = Date.now();

    // Refresh 30 seconds before expiry
    if (now >= expiresAt - 30000) {
      return await this.refreshToken();
    }

    return this.getAccessToken();
  }

  logout() {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("expires_at");
  }
}

export default new AuthService();