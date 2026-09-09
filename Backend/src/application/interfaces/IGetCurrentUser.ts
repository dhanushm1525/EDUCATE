import { GetCurrentUserDTO } from "../dtos/auth/GetCurrentUserDTO"
import { GetCurrentUserResponseDTO } from "../dtos/auth/GetCurrentUserResponseDTO"


export interface IGetCurrentUser{
    execute(request:GetCurrentUserDTO):Promise<GetCurrentUserResponseDTO>
}