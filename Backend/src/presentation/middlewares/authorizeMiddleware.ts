import { HttpStatusCode } from "../../shared/enums/HttpStatusCode";

import { Request,Response,NextFunction } from "express";
import { UserRole } from "../../shared/enums/UserRole";
import { AppError } from "../../shared/errors/AppError";
import { AUTH_MESSAGES } from "../../shared/messages/authMessages";


export const authorize=(
    ...allowedRoles:UserRole[]
)=>{
    return (
        req:Request,
        _res:Response,
        next:NextFunction
    )=>{
        try{
            if(!req.user){
                throw new AppError(AUTH_MESSAGES.AUTHENTICATION_REQUIRED,HttpStatusCode.UNAUTHORIZED);
            }

            if(!allowedRoles.includes(req.user.role)){
                throw new AppError(AUTH_MESSAGES.UNAUTHORIZED,HttpStatusCode.FORBIDDEN);
            }


            next()
        }catch(error){
            next(error)
        }
    }
}