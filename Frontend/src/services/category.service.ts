import { apiClient } from "./apiClient";

import { API_ROUTES } from "../constants/apiRoutes";

import type {
    Category,
    CategoryApiResponse,
    CreateCategoryRequest,
} from "../types/category";

export const categoryService = {

    getCategories: async (): Promise<Category[]> => {

        const response =
            await apiClient.get<CategoryApiResponse<Category[]>>(
                API_ROUTES.categories.base
            );

        return response.data.data;
    },

    createCategory: async (
        payload: CreateCategoryRequest
    ): Promise<Category> => {

        const response =
            await apiClient.post<CategoryApiResponse<Category>>(
                API_ROUTES.categories.base,
                payload
            );

        return response.data.data;
    },
};