import { Request,Response,NextFunction } from "express";
import { IResetPassword } from "../../../../application/interfaces/auth/IResetPassword";
import { successResponse } from "../../../../shared/response/apiResponse";


export class ResetPasswordController{
    constructor(
        private readonly _resetPassword: IResetPassword
    ){}


    async handle(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{
        try{

            const {email,otp,newPassword} = req.body;

            const result = await this._resetPassword.execute({
                email,otp,newPassword
            });


            successResponse(res,200,result.message,result)

        }catch(error){
            next(error)
        }
    }
}