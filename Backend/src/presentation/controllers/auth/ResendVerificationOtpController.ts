import { Request,Response,NextFunction } from "express";
import { ResendVerificationOtp } from "../../../application/use-cases/auth/ResendVerificationOtp";
import { successResponse } from "../../../shared/response/apiResponse";



export class ResendVerificationOtpController{
    constructor(
        private readonly resendVerificationOtp:ResendVerificationOtp
    ){}


    async handle(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{

        try{

            const {email} = req.body;

            const result = await this.resendVerificationOtp.execute({
                email
            });

            successResponse(res,200,result.message,result);
        }catch(error){
            next(error)
        }
    }
}