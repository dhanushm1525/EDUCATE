const API_URL = import.meta.env.VITE_API_URL;


export const api = {
    get: async <T>(endpoint: string): Promise<T> => {
        const response = await fetch(`${API_URL}${endpoint}`);

        if (!response.ok) {
            throw new Error("API request failed")
        }

        return response.json()
    },

    post: async <T>(
        endpoint: string,
        data: unknown
    ): Promise<T> => {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("API request failed");
        }

        return response.json();
    }

}