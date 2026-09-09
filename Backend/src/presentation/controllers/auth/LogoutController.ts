import { Request,Response,NextFunction } from "express";
import { ILogoutUser } from "../../../application/interfaces/ILogoutUser";
import { successResponse } from "../../../shared/response/apiResponse";
import { IRefreshTokenCookie } from "../../../application/interfaces/IRefreshTokenCookie";



export class LogoutController{
    constructor(
        private readonly logoutuser:ILogoutUser,
        private readonly refreshTokenCookie:IRefreshTokenCookie
    ){}


    async handle(
        req:Request,
        res:Response,
        next:NextFunction
    ){
        try{
            const refreshToken = req.cookies[this.refreshTokenCookie.name];

            await this.logoutuser.execute({
                refreshToken
            });

            res.clearCookie(
                this.refreshTokenCookie.name,
                {
                    httpOnly:this.refreshTokenCookie.options.httpOnly,
                    secure:this.refreshTokenCookie.options.secure,
                    sameSite:this.refreshTokenCookie.options.sameSite,
                    path:this.refreshTokenCookie.options.path
                }
            );

            return successResponse(res,200,"LoggedOut successfully",null);
        }catch(error){
            next(error)
        }
    }
}