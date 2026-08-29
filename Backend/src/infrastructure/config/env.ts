import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
    "MONGO_URI",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "RESEND_API_KEY",
    "EMAIL_FROM"
];

for (const key of requiredEnv) {
    if (!process.env[key]) {
        throw new Error(
            `Missing Environment variables: ${key}`
        );
    }
}

export const env = {
    nodeEnv:
        process.env.NODE_ENV ?? "development",

    port:
        Number(process.env.PORT ?? 5050),

    mongoUri:
        process.env.MONGO_URI!,

    clientUrl:
        process.env.CLIENT_URL ??
        "http://localhost:5173",

    jwtAccessSecret:
        process.env.JWT_ACCESS_SECRET!,

    jwtAccessExpiresIn:
        process.env.JWT_ACCESS_EXPIRES_IN ??
        "15m",

    jwtRefreshSecret:
        process.env.JWT_REFRESH_SECRET!,

    jwtRefreshExpiresIn:
        process.env.JWT_REFRESH_EXPIRES_IN ??
        "3d",

    refreshTokenCookieName:
        process.env.REFRESH_TOKEN_COOKIE_NAME ??
        "educate_refresh_token",

    refreshTokenCookieMaxAge:
        Number(
            process.env.REFRESH_TOKEN_COOKIE_MAX_AGE ??
            259200000
        ),

    resendApiKey:process.env.RESEND_API_KEY!,

    emailFrom:process.env.EMAIL_FROM!,

    emailVerificationOtpExpiresInMs:
    Number(
        process.env.EMAIL_VERIFICATION_OTP_EXPIRES_IN_MS ??
        600000
    ),
    passwordResetOtpExpiresInMs:
    Number(
        process.env.PASSWORD_RESET_OTP_EXPIRES_IN_MS
    ),
};