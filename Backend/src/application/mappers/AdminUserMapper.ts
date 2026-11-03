import { User } from "../../domain/entities/User";
import {
    AdminUserDTO,
    PaginatedUsersDTO
} from "../dtos/user/AdminUserDTO";

export class AdminUserMapper {

    static toDTO(user: User): AdminUserDTO {
        return {
            id: user.id!,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            status: user.status,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }

    static toPaginatedDTO(
        users: User[],
        total: number,
        page: number,
        limit: number
    ): PaginatedUsersDTO {
        return {
            users: users.map(user => this.toDTO(user)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
}