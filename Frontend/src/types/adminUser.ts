import type { UserRole } from "./userRole";

export type AdminUserStatus = "active" | "blocked" | "pending";

export interface AdminUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    role: UserRole;
    status: AdminUserStatus;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AdminUserFilters {
    role?: UserRole;
    status?: AdminUserStatus;
    search?: string;
    page?: number;
    limit?: number;
}

export interface PaginatedUsers {
    users: AdminUser[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface AdminUsersResponse {
    success: boolean;
    message: string;
    data: PaginatedUsers;
}

export interface AdminUserResponse {
    success: boolean;
    message: string;
    data: AdminUser;
}