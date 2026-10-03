import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";

import { Request,Response,NextFunction } from "express";
import { IResetPassword } from "../../../../application/interfaces/auth/IResetPassword";
import { successResponse } from "../../../../shared/response/apiResponse";
import { AuthRequestMapper } from "../../../../application/mappers/AuthRequestMapper";


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

            const dto = AuthRequestMapper.toResetPasswordDTO(req.body);
            const result = await this._resetPassword.execute(dto);


            successResponse(res,HttpStatusCode.OK,result.message,result)

        }catch(error){
            next(error)
        }
    }
}