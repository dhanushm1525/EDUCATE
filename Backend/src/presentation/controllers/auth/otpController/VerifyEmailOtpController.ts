import { Request, Response, NextFunction } from "express";
import { IVerifyEmailOtp } from "../../../../application/interfaces/auth/IVerifyEmailOtp";
import { successResponse } from "../../../../shared/response/apiResponse";




export class VerifyEmailOtpController {
    constructor(
        private readonly _verifyEmailOtp: IVerifyEmailOtp
    ) { }
    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const { userId, otp } = req.body;

            const result = await this._verifyEmailOtp.execute({
                userId, otp
            });

            successResponse(res, 200, result.message, result);
        } catch (error) {
            next(error)
        }
    }

}