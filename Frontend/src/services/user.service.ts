import { apiClient } from "./apiClient";

import type {
    GetMyProfileResponse
} from "../types/user";


export const userService = {

    getMyProfile: async (): Promise<GetMyProfileResponse> => {

        const response =
            await apiClient.get(
                "/users/profile"
            );

        return response.data;

    }

};