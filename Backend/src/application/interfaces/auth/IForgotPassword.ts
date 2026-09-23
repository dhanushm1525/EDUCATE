import { ForgotPasswordDTO } from "../../dtos/auth/ForgotPasswordDTO";
import { ForgotPasswordResponseDTO } from "../../dtos/auth/ForgotPasswordResponseDTO";

export interface IForgotPassword {
    execute(request: ForgotPasswordDTO): Promise<ForgotPasswordResponseDTO>;
}
