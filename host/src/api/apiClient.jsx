const API_BASE_URL = "http://localhost:8081";

const createApiClient = (authService) => ({

    async get(path) {

        // Get a valid access token.
        // If it is close to expiry, authService
        // will refresh it automatically.
        const token = await authService.getValidToken();

        if (!token) {
            throw new Error("Access token is not available");
        }

        const response = await fetch(
            `${API_BASE_URL}${path}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                `API request failed: ${response.status}`
            );
        }

        return response.json();
    }
});

export default createApiClient;