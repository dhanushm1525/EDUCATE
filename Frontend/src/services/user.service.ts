import { apiClient } from "./apiClient";
import { API_ROUTES } from "../constants/apiRoutes";

import type {
    GetMyProfileResponse
} from "../types/user";


export const userService = {

    getMyProfile: async (): Promise<GetMyProfileResponse> => {

        const response =
            await apiClient.get(
                API_ROUTES.users.profile
            );

        return response.data;

    }

};