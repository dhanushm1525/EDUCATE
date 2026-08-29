import { IAuthConfig } from "../../application/interfaces/IAuthConfig";
import { env } from "./env";

export const authConfig: IAuthConfig = {
    refreshTokenExpiresInMs:
        env.refreshTokenCookieMaxAge,

    emailVerificationOtpExpiresInMs:
        env.emailVerificationOtpExpiresInMs,
    
    passwordResetOtpExpiresInMs:env.passwordResetOtpExpiresInMs

};