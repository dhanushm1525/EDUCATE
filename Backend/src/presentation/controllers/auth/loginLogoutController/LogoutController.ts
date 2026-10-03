import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";

import { Request,Response,NextFunction } from "express";
import { ILogoutUser } from "../../../../application/interfaces/auth/ILogoutUser";
import { successResponse } from "../../../../shared/response/apiResponse";
import { IRefreshTokenCookie } from "../../../../application/interfaces/auth/IRefreshTokenCookie";
import { AuthRequestMapper } from "../../../../application/mappers/AuthRequestMapper";



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

            await this._logoutuser.execute(
                AuthRequestMapper.toLogoutUserDTO(refreshToken)
            );

            res.clearCookie(
                this._refreshTokenCookie.name,
                {
                    httpOnly:this._refreshTokenCookie.options.httpOnly,
                    secure:this._refreshTokenCookie.options.secure,
                    sameSite:this._refreshTokenCookie.options.sameSite,
                    path:this._refreshTokenCookie.options.path
                }
            );

            return successResponse(res,HttpStatusCode.OK,"LoggedOut successfully",null);
        }catch(error){
            next(error)
        }
    }
}