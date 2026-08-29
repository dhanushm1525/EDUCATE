import { SendVerificationOtpDTO } from "../dtos/auth/SendVerificationOtpDTO";


export interface ISendVerificationOtp{
    execute(request:SendVerificationOtpDTO):Promise<void>
}