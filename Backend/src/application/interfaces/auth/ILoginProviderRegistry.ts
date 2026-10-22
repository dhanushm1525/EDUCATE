import { AuthProvider } from "../../../shared/enums/AuthProvider";
import { ILoginProviderStrategy } from "./ILoginProviderStrategy";

export interface ILoginProviderRegistry {
    get(provider: AuthProvider): ILoginProviderStrategy;
}
