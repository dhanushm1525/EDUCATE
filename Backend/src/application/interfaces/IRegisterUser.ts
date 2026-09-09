import { RegisterUserDTO } from "../dtos/auth/RegisterUserDTO";
import { RegisterUserResponseDTO } from "../dtos/auth/RegisterUserResponseDTO";


export interface IRegisterUser{
    execute(request:RegisterUserDTO):Promise<RegisterUserResponseDTO>
}