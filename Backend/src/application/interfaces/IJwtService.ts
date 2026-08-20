export interface AccessTokenPayload{
    userId:string;
    roles:"student"|"teacher"|"admin";
}

export interface IJwtService{
    generateAccessToken(payload:AccessTokenPayload):string;

    generateRefreshToken(userId:string):string;

    verifyAccessToken(token:string):AccessTokenPayload;

    verifyRefreshToken(token:string):{userId:string};
}