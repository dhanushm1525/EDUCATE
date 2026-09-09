import { Request,Response,NextFunction } from "express";
import { ILogoutUser } from "../../../application/interfaces/ILogoutUser";
import { successResponse } from "../../../shared/response/apiResponse";
import { IRefreshTokenCookie } from "../../../application/interfaces/IRefreshTokenCookie";



export class LogoutController{
    constructor(
        private readonly _logoutuser:ILogoutUser,
        private readonly _refreshTokenCookie:IRefreshTokenCookie
    ){}


    async handle(
        req:Request,
        res:Response,
        next:NextFunction
    ){
        try{
            const refreshToken = req.cookies[this._refreshTokenCookie.name];

            await this._logoutuser.execute({
                refreshToken
            });

            res.clearCookie(
                this._refreshTokenCookie.name,
                {
                    httpOnly:this._refreshTokenCookie.options.httpOnly,
                    secure:this._refreshTokenCookie.options.secure,
                    sameSite:this._refreshTokenCookie.options.sameSite,
                    path:this._refreshTokenCookie.options.path
                }
            );

            return successResponse(res,200,"LoggedOut successfully",null);
        }catch(error){
            next(error)
        }
    }
}