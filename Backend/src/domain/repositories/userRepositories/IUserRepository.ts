
import { User } from "../../entities/User";
import { UserRole } from "../../../shared/enums/UserRole";
import { UserStatus } from "../../../shared/enums/UserStatus";

export interface UserFilters {
    role?: UserRole;
    status?: UserStatus;
    search?: string;
    page: number;
    limit: number;
}

export interface PaginatedUsers {
    users: User[];
    total: number;
}

export interface IUserRepository {
    create(user: User): Promise<User>;

    findById(id: string): Promise<User | null>;

    findByIds(ids: string[]): Promise<User[]>;

    findByEmail(email: string): Promise<User | null>;

    update(user: User): Promise<User>;

    existsByEmail(email: string): Promise<boolean>;

    findAll(filters: UserFilters): Promise<PaginatedUsers>;
}
