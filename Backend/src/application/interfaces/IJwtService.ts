import { UserRole } from "../../shared/enums/UserRole";


export interface AccessTokenPayload {
    userId: string;
    role: UserRole;
}


export interface IJwtService {

    generateAccessToken(
        payload: AccessTokenPayload
    ): string;

    generateRefreshToken(
        userId: string
    ): string;

    verifyAccessToken(
        token: string
    ): AccessTokenPayload;

    verifyRefreshToken(
        token: string
    ): {
        userId: string;
    };
}