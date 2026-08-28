import { Request,Response,NextFunction } from "express";
import { UserRole } from "../../shared/enums/UserRole";
import { AppError } from "../../shared/errors/AppError";


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
                throw new AppError("Authentication required",401);
            }

            if(!allowedRoles.includes(req.user.role)){
                throw new AppError("You are not authorized to access this resource",403);
            }


            next()
        }catch(error){
            next(error)
        }
    }
}