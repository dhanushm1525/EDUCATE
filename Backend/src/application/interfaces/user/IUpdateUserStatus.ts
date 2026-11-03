import { UserStatus } from "../../../shared/enums/UserStatus";

import { User } from "../../../domain/entities/User";

export interface IUpdateUserStatus {
    execute(
        userId: string,
        status: UserStatus
    ): Promise<User>;
}