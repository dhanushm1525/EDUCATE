import { Request,Response,NextFunction } from "express";
import { IForgotPassword } from "../../../../application/interfaces/auth/IForgotPassword";
import { successResponse } from "../../../../shared/response/apiResponse";


export class ForgotPasswordController{
    constructor(private readonly _forgotPassword: IForgotPassword){}

    async handle(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{

        try{
            const {email} = req.body;

            const result = await this._forgotPassword.execute({email});

            successResponse(res,200,result.message,result);
        }catch(error){
            next(error)
        }
    }
}