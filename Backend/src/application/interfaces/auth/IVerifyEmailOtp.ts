import { VerifyEmailOtpDTO } from "../../dtos/auth/VerifyEmailOtpDTO";
import { VerifyEmailOtpResponseDTO } from "../../dtos/auth/VerifyEmailOtpResponseDTO";

export interface IVerifyEmailOtp {
    execute(request: VerifyEmailOtpDTO): Promise<VerifyEmailOtpResponseDTO>;
}
