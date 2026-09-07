import { LoginUserDTO } from "../dtos/auth/LoginUserDTO";
import { LoginUserResponseDTO } from "../dtos/auth/LoginUserResponseDTO";

export interface ILoginUser {
    execute(
        request: LoginUserDTO
    ): Promise<{
        response: LoginUserResponseDTO;
        refreshToken: string;
    }>;
}