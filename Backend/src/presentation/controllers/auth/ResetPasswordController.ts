import { Request,Response,NextFunction } from "express";
import { ResetPassword } from "../../../application/use-cases/auth/ResetPassword";
import { successResponse } from "../../../shared/response/apiResponse";


export class ResetPasswordController{
    constructor(
        private readonly resetPassword:ResetPassword
    ){}


    async handle(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{
        try{

            const {email,otp,newPassword} = req.body;

            const result = await this.resetPassword.execute({
                email,otp,newPassword
            });


            successResponse(res,200,result.message,result)

        }catch(error){
            next(error)
        }
    }
}