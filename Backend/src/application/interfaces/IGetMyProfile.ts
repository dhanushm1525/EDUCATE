import { GetMyProfileDTO } from "../dtos/user/GetMyProfileDTO";
import { GetMyProfileResponseDTO } from "../dtos/user/GetMyProfileResponseDTO";

export interface IGetMyProfile{
    execute(request:GetMyProfileDTO):Promise<GetMyProfileResponseDTO>
}