import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";

import { Request,Response,NextFunction } from "express";
import { IForgotPassword } from "../../../../application/interfaces/auth/IForgotPassword";
import { successResponse } from "../../../../shared/response/apiResponse";
import { AuthRequestMapper } from "../../../../application/mappers/AuthRequestMapper";


export class ForgotPasswordController{
    constructor(private readonly _forgotPassword: IForgotPassword){}

    async handle(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{

        try{
            const dto = AuthRequestMapper.toForgotPasswordDTO(req.body);
            const result = await this._forgotPassword.execute(dto);

            successResponse(res,HttpStatusCode.OK,result.message,result);
        }catch(error){
            next(error)
        }
    }
}