import jwt,{SignOptions} from "jsonwebtoken";
import {AccessTokenPayload,IJwtService} from "../../application/interfaces/IJwtService";
import {env} from "../config/env";


export class JwtService implements IJwtService{
    generateAccessToken(payload: AccessTokenPayload): string {
        return jwt.sign(payload,env.jwtAccessSecret,{expiresIn:env.jwtAccessExpiresIn as SignOptions["expiresIn"]});
    }


    generateRefreshToken(userId: string): string {
        return jwt.sign({userId},env.jwtRefreshSecret,{expiresIn:env.jwtRefreshExpiresIn as SignOptions["expiresIn"]});
    }


    verifyAccessToken(token: string): AccessTokenPayload {
        return jwt.verify(token,env.jwtAccessSecret) as AccessTokenPayload;
    }


    verifyRefreshToken(token: string): { userId: string; } {
        return jwt.verify(token,env.jwtRefreshSecret) as {userId:string};
    }
}