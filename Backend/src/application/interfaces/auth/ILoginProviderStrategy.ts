import { User } from "../../../domain/entities/User";
import { AuthProvider } from "../../../shared/enums/AuthProvider";

export interface ILoginProviderStrategy {
    readonly provider: AuthProvider;
    authenticate(user: User, credential: string): Promise<void>;
}
