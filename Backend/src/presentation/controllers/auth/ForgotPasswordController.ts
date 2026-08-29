import { Request,Response,NextFunction } from "express";
import { ForgotPassword } from "../../../application/use-cases/auth/ForgotPassword";
import { successResponse } from "../../../shared/response/apiResponse";


export class ForgotPasswordController{
    constructor(private readonly forgotPassword:ForgotPassword){}

    async handle(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{

        try{
            const {email} = req.body;

            const result = await this.forgotPassword.execute({email});

            successResponse(res,200,result.message,result);
        }catch(error){
            next(error)
        }
    }
}