import { AppError } from "../../../shared/errors/AppError";
import { AuthProvider } from "../../../shared/enums/AuthProvider";
import { ILoginProviderStrategy } from "../../interfaces/auth/ILoginProviderStrategy";

export class LoginProviderRegistry {
    private readonly strategies: Map<
        AuthProvider,
        ILoginProviderStrategy
    >;

    constructor(strategies: ILoginProviderStrategy[]) {
        this.strategies = new Map(
            strategies.map(strategy => [
                strategy.provider,
                strategy
            ])
        );
    }

    get(provider: AuthProvider): ILoginProviderStrategy {
        const strategy = this.strategies.get(provider);

        if (!strategy) {
            throw new AppError(
                "Unsupported authentication provider",
                400
            );
        }

        return strategy;
    }
}
