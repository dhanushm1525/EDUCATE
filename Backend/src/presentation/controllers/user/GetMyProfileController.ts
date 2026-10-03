import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { Request,Response,NextFunction } from "express";
import { IGetMyProfile } from "../../../application/interfaces/user/IGetMyProfile";
import { successResponse } from "../../../shared/response/apiResponse";
import { AUTH_MESSAGES } from "../../../shared/messages/authMessages";
import { AppError } from "../../../shared/errors/AppError";
import { UserRequestMapper } from "../../../application/mappers/UserRequestMapper";


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
                return next(new AppError(AUTH_MESSAGES.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED));
            }
            
            
            const result = await this._getMyprofile.execute(
                UserRequestMapper.toGetMyProfileDTO(userId)
            );

            successResponse(res,HttpStatusCode.OK,AUTH_MESSAGES.PROFILE_RETRIEVED_SUCCESSFULLY,result)
        }catch(error){
            
            next(error)
        }
    }
}