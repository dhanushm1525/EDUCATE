import { apiClient } from "./apiClient";
import { API_ROUTES } from "../constants/apiRoutes";

import type {
    AdminUser,
    AdminUserFilters,
    AdminUsersResponse,
    AdminUserResponse,
    PaginatedUsers,
    AdminUserStatus,
} from "../types/adminUser";

export const adminUserService = {

    getUsers: async (
        filters: AdminUserFilters = {}
    ): Promise<PaginatedUsers> => {

        const response =
            await apiClient.get<AdminUsersResponse>(
                API_ROUTES.adminUsers.base,
                { params: filters }
            );

        return response.data.data;
    },

    updateUserStatus: async (
        userId: string,
        status: AdminUserStatus
    ): Promise<AdminUser> => {

        const response =
            await apiClient.patch<AdminUserResponse>(
                API_ROUTES.adminUsers.updateStatus(userId),
                { status }
            );

        return response.data.data;
    },
};