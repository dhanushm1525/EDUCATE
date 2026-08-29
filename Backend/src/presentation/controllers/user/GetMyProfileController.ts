import { Request,Response,NextFunction } from "express";
import { GetMyProfile } from "../../../application/use-cases/user/GetMyProfile";
import { successResponse } from "../../../shared/response/apiResponse";
import { AUTH_MESSAGES } from "../../../shared/messages/authMessages";


export class GetMyProfileController{
    constructor(private readonly getMyprofile:GetMyProfile){}

    async handle(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{

        try{
            
            const userId = req.user?.userId;
            

            if(!userId){
                return next(new Error("Unauthorized"));
            }
            
            const result = await this.getMyprofile.execute(userId);

            successResponse(res,200,AUTH_MESSAGES.PROFILE_RETRIEVED_SUCCESSFULLY,result)
        }catch(error){
            
            next(error)
        }
    }
}