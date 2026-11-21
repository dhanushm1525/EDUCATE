import { IGetUsers } from "../../interfaces/user/IGetUsers";

import {
  IUserRepository,
  UserFilters,
} from "../../../domain/repositories/userRepositories/IUserRepository";

import { AdminUserMapper } from "../../mappers/AdminUserMapper";
import type { IStorageService } from "../../interfaces/storage/IStorageService";
import type { IProfileImagePolicy } from "../../interfaces/user/IProfileImagePolicy";

export class GetUsers implements IGetUsers {
  constructor(
    private readonly _userRepository: IUserRepository,
    private readonly _storageService: IStorageService,
    private readonly _profileImagePolicy: IProfileImagePolicy,
  ) {}

  async execute(filters: UserFilters) {
    const page = Math.max(1, filters.page);
    const limit = Math.min(100, Math.max(1, filters.limit));

    const result = await this._userRepository.findAll({
      ...filters,
      page,
      limit,
    });

    // Convert S3 keys into downloadable URLs.
    // Google profile URLs are kept unchanged.
    const users = await Promise.all(
      result.users.map(async (user) => {
        const userDTO = AdminUserMapper.toDTO(user);

        if (userDTO.avatar && this._profileImagePolicy.isManagedImage(userDTO.avatar)) {
          userDTO.avatar = await this._storageService.generateDownloadUrl(userDTO.avatar);
        }

        return userDTO;
      }),
    );

    return {
      users,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit),
    };
  }
}
