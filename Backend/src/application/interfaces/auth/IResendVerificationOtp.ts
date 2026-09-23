import { ResendVerificationOtpDTO } from "../../dtos/auth/ResendVerificationOtpDTO";
import { ResendVerificationOtpResponseDTO } from "../../dtos/auth/ResendVerificationOtpResponseDTO";

export interface IResendVerificationOtp {
    execute(request: ResendVerificationOtpDTO): Promise<ResendVerificationOtpResponseDTO>;
}
