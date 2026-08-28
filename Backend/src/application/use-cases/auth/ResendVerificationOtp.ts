import { AppError }
    from "../../../shared/errors/AppError";

import { AUTH_MESSAGES }
    from "../../../shared/messages/authMessages";

import { IUserRepository }
    from "../../../domain/repositories/IUserRepository";

import { SendVerificationOtp }
    from "./SendVerificationOtp";

import { ResendVerificationOtpDTO }
    from "../../dtos/auth/ResendVerificationOtpDTO";

import { ResendVerificationOtpResponseDTO }
    from "../../dtos/auth/ResendVerificationOtpResponseDTO";


export class ResendVerificationOtp {

    constructor(
        private readonly userRepository:
            IUserRepository,

        private readonly sendVerificationOtp:
            SendVerificationOtp
    ) { }


    async execute(
        request: ResendVerificationOtpDTO
    ): Promise<ResendVerificationOtpResponseDTO> {

        const email =
            request.email
                .trim()
                .toLowerCase();


        const user =
            await this.userRepository
                .findByEmail(email);


        if (!user) {
            throw new AppError(
                AUTH_MESSAGES.USER_NOT_FOUND,
                404
            );
        }


        if (user.isVerified) {
            throw new AppError(
                "Email is already verified",
                400
            );
        }


        if (!user.id) {
            throw new AppError(
                "User ID is missing",
                500,
                false
            );
        }


        await this.sendVerificationOtp.execute({
            userId: user.id,
            email: user.email
        });


        return {
            message:
                "Verification OTP sent successfully"
        };
    }
}