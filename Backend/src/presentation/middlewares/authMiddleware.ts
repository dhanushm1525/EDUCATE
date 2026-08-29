import { Request,Response,NextFunction } from "express";
import { IJwtService } from "../../application/interfaces/IJwtService";
import { AppError } from "../../shared/errors/AppError";



export const authMiddleware=(
    jwtService:IJwtService
)=>{
    return(
        req:Request,
        _res:Response,
        next:NextFunction
    )=>{
        
        try{
            const authorizationHeader = req.headers.authorization;

            if(!authorizationHeader){
                throw new AppError("authentication token is required",401);
            }


            const [scheme,token] = authorizationHeader.split(" ");

            if(scheme!=="Bearer"||!token){
                throw new AppError("Invalid authentication token",401)
            }

            const payload = jwtService.verifyAccessToken(token);

            req.user = {
                userId:payload.userId,
                role:payload.role
            };
            
            next()
        }catch(error){
            if(error instanceof AppError){
                return next(error)
            }

            return next(new AppError("invalid or expired token",401))
        }

    }
}