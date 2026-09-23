import { ResetPasswordDTO } from "../../dtos/auth/ResetPasswordDTO";
import { ResetPasswordResponseDTO } from "../../dtos/auth/ResetPasswordResponseDTO";

export interface IResetPassword {
    execute(request: ResetPasswordDTO): Promise<ResetPasswordResponseDTO>;
}
