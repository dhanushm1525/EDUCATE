import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { User } from "../../../domain/entities/User";
import { AuthProvider } from "../../../shared/enums/AuthProvider";
import { AppError } from "../../../shared/errors/AppError";
import { ILoginProviderStrategy } from "../../interfaces/auth/ILoginProviderStrategy";
import { IPasswordHasher } from "../../interfaces/services/IPasswordHasher";

export class LocalPasswordLoginStrategy
    implements ILoginProviderStrategy {

    readonly provider = AuthProvider.LOCAL;

    constructor(
        private readonly _passwordHasher: IPasswordHasher
    ) {}

    async authenticate(
        user: User,
        password: string
    ): Promise<void> {
        if (!user.password) {
            throw new AppError(
                "Invalid credentials",
                HttpStatusCode.UNAUTHORIZED
            );
        }

        const matches = await this._passwordHasher.compare(
            password,
            user.password
        );

        if (!matches) {
            throw new AppError(
                "Invalid credentials",
                HttpStatusCode.UNAUTHORIZED
            );
        }
    }
}
