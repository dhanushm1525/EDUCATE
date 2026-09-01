import { apiClient } from "./apiClient";
import type {
    RegisterRequest,
    RegisterResponse
} from "../types/auth";


export const authService = {

    register: async (
        data: RegisterRequest
    ): Promise<RegisterResponse> => {

        const response = await apiClient.post(
            "/auth/register",
            data
        );

        return response.data;
    }

};