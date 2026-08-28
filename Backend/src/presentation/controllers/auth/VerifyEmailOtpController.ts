import { Request, Response, NextFunction } from "express";
import { VerifyEmailOtp } from "../../../application/use-cases/auth/VerifyEmailOtp";
import { successResponse } from "../../../shared/response/apiResponse";



export class VerifyEmailOtpController {
    constructor(
        private readonly verifyEmailOtp: VerifyEmailOtp
    ) { }

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {

        try {
            const { userId, otp } = req.body;

            const result = await this.verifyEmailOtp.execute({
                userId, otp
            });

            successResponse(res, 200, result.message, result);
        } catch (error) {
            next(error)
        }
    }

}