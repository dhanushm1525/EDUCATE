export interface IRefreshTokenCookie {
    name: string;

    options: {
        httpOnly: boolean;
        secure: boolean;
        sameSite: "lax" | "strict" | "none";
        maxAge: number;
        path: string;
    };
}