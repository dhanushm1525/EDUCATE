import { IRefreshTokenCookie } from "../../application/interfaces/IRefreshTokenCookie";
import { env } from "./env";

export const refreshTokenCookie: IRefreshTokenCookie = {
    name: env.refreshTokenCookieName,

    options: {
        httpOnly: true,
        secure: env.nodeEnv === "production",
        sameSite: "lax",
        maxAge: Number(env.refreshTokenCookieMaxAge),
        path: "/api/auth"
    }
};