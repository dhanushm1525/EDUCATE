import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { AppError } from "../../../shared/errors/AppError";
import { AuthProvider } from "../../../shared/enums/AuthProvider";
import { ILoginProviderStrategy } from "../../interfaces/auth/ILoginProviderStrategy";

export class LoginProviderRegistry {
    private readonly _strategies: Map<
        AuthProvider,
        ILoginProviderStrategy
    >;

    constructor(strategies: ILoginProviderStrategy[]) {
        this._strategies = new Map(
            strategies.map(strategy => [
                strategy.provider,
                strategy
            ])
        );
    }

    get(provider: AuthProvider): ILoginProviderStrategy {
        const strategy = this._strategies.get(provider);

        if (!strategy) {
            throw new AppError(
                "Unsupported authentication provider",
                HttpStatusCode.BAD_REQUEST
            );
        }

        return strategy;
    }
}
