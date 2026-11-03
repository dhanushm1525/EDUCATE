import { IGetUsers } from "../../interfaces/user/IGetUsers";

import {
    IUserRepository,
    UserFilters
} from "../../../domain/repositories/userRepositories/IUserRepository";

import { AdminUserMapper } from "../../mappers/AdminUserMapper";

export class GetUsers implements IGetUsers {

    constructor(
        private readonly _userRepository: IUserRepository
    ) {}

    async execute(filters: UserFilters) {

        const page = Math.max(1, filters.page);
        const limit = Math.min(100, Math.max(1, filters.limit));

        const result = await this._userRepository.findAll({
            ...filters,
            page,
            limit
        });

        return AdminUserMapper.toPaginatedDTO(
            result.users,
            result.total,
            page,
            limit
        );
    }
}