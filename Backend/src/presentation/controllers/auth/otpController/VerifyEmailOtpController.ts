import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";

import { Request, Response, NextFunction } from "express";
import { IVerifyEmailOtp } from "../../../../application/interfaces/auth/IVerifyEmailOtp";
import { successResponse } from "../../../../shared/response/apiResponse";
import { AuthRequestMapper } from "../../../../application/mappers/AuthRequestMapper";




export class VerifyEmailOtpController {
    constructor(
        private readonly _verifyEmailOtp: IVerifyEmailOtp
    ) { }
    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const dto = AuthRequestMapper.toVerifyEmailOtpDTO(req.body);
            const result = await this._verifyEmailOtp.execute(dto);

            successResponse(res, HttpStatusCode.OK, result.message, result);
        } catch (error) {
            next(error)
        }
    }

}