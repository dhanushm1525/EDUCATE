import jwt,{SignOptions,JwtPayload} from "jsonwebtoken";
import {AccessTokenPayload,IJwtService} from "../../application/interfaces/IJwtService";
import {env} from "../config/env";
import { UserRole } from "../../shared/enums/UserRole";
import { AppError } from "../../shared/errors/AppError";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages";


export class JwtService implements IJwtService{
    generateAccessToken(payload: AccessTokenPayload): string {
        return jwt.sign(payload,env.jwtAccessSecret,{expiresIn:env.jwtAccessExpiresIn as SignOptions["expiresIn"]});
    }


    generateRefreshToken(userId: string): string {
        return jwt.sign({userId},env.jwtRefreshSecret,{expiresIn:env.jwtRefreshExpiresIn as SignOptions["expiresIn"]});
    }


     verifyAccessToken(token: string): AccessTokenPayload {

        const decoded = jwt.verify(
            token,
            env.jwtAccessSecret
        );


        if (
            typeof decoded === "string" ||
            !this.isAccessTokenPayload(decoded)
        ) {
            throw new AppError(AUTH_MESSAGES.INVALID_ACCESS_TOKEN,401);
        }


        return decoded;
    }


    verifyRefreshToken(token: string): { userId: string } {

    const decoded = jwt.verify(token,env.jwtRefreshSecret);


    if (typeof decoded === "string" ||!this.isRefreshTokenPayload(decoded)){
        throw new AppError(AUTH_MESSAGES.INVALID_REFRESH_TOKEN,401);}

        return {userId: decoded.userId};
    }

    private isAccessTokenPayload(payload: string |JwtPayload): payload is AccessTokenPayload {

        return (
            typeof payload === "object" &&
            payload !== null &&
            typeof payload.userId === "string" &&
            Object.values(UserRole).includes(
                payload.role as UserRole
            )
        );
    }


    private isRefreshTokenPayload(payload: string | JwtPayload): payload is { userId: string } {

        return (
            typeof payload === "object" &&
            payload !== null &&
            typeof payload.userId === "string"
        );
    }
}