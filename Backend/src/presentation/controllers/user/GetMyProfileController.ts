import { Request,Response,NextFunction } from "express";
import { IGetMyProfile } from "../../../application/interfaces/IGetMyProfile";
import { successResponse } from "../../../shared/response/apiResponse";
import { AUTH_MESSAGES } from "../../../shared/messages/authMessages";
import { AppError } from "../../../shared/errors/AppError";


export class GetMyProfileController{
    constructor(private readonly _getMyprofile:IGetMyProfile){}

    async handle(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{

        try{
            
            const userId = req.user?.userId;
            

            if(!userId){
                return next(new AppError(AUTH_MESSAGES.UNAUTHORIZED, 401));
            }
            
            
            const result = await this._getMyprofile.execute({userId});

            successResponse(res,200,AUTH_MESSAGES.PROFILE_RETRIEVED_SUCCESSFULLY,result)
        }catch(error){
            
            next(error)
        }
    }
}