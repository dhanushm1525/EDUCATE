import { User } from "../../../domain/entities/User";
import { AuthProvider } from "../../../shared/enums/AuthProvider";
import { AppError } from "../../../shared/errors/AppError";
import { ILoginProviderStrategy } from "../../interfaces/auth/ILoginProviderStrategy";

export class GoogleLoginStrategy
    implements ILoginProviderStrategy {

    readonly provider = AuthProvider.GOOGLE;

    async authenticate(
        _user: User,
        _credential: string
    ): Promise<void> {
        throw new AppError(
            "Please sign in using Google",
            400
        );
    }
}
