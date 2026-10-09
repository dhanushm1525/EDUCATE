export type CategoryStatus = "active" | "inactive";

export interface Category {
    categoryId: string;
    name: string;
    description?: string;
    image?: string;
    status: CategoryStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryRequest {
    name: string;
    description?: string;
    image?: string;
}

export interface CategoryApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}