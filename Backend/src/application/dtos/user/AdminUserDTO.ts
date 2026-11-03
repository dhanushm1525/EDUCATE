import { UserRole } from "../../../shared/enums/UserRole";
import { UserStatus } from "../../../shared/enums/UserStatus";

export interface AdminUserDTO {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    role: UserRole;
    status: UserStatus;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface PaginatedUsersDTO {
    users: AdminUserDTO[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}