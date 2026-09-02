import { Request,Response,NextFunction, CookieOptions } from "express";
import { RefreshAccessToken } from "../../../application/use-cases/auth/RefreshAccessToken";
import { RefreshAccessTokenDTO } from "../../../application/dtos/auth/RefreshAccessTokenDTO";
import { successResponse } from "../../../shared/response/apiResponse";


export class RefreshTokenController{
    constructor(
        private readonly refreshAccessToken:RefreshAccessToken,
        private readonly refreshTokenCookie:{
            name:string;
            options:CookieOptions;
        }
    ){}

    async handle(
        req:Request,
        res:Response,
        next:NextFunction
    ){
        try{
            const refreshToken = req.cookies[this.refreshTokenCookie.name]

            if(!refreshToken){
                return res.status(401).json({
                    success:false,
                    message:"Refresh token is required"
                });
            }

            const dto : RefreshAccessTokenDTO = {refreshToken};

            const result = await this.refreshAccessToken.execute(dto);

            res.cookie(
                this.refreshTokenCookie.name,
                result.refreshToken,
                this.refreshTokenCookie.options
            );

            return successResponse(res,200,"access token refreshed successfully",{accessToken:result.accessToken});


        }catch(error){
             console.error(
        "REFRESH TOKEN ERROR:",
        error
    );

            next(error)
        }
    }

}