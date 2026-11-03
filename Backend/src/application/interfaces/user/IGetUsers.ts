import { UserFilters } from "../../../domain/repositories/userRepositories/IUserRepository";
import { PaginatedUsersDTO } from "../../dtos/user/AdminUserDTO";

export interface IGetUsers {
    execute(filters: UserFilters): Promise<PaginatedUsersDTO>;
}