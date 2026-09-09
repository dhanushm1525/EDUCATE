import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { GetMyProfileResponseDTO } from "../../dtos/user/GetMyProfileResponseDTO";
import { AppError } from "../../../shared/errors/AppError";
import { AUTH_MESSAGES } from "../../../shared/messages/authMessages";
import { IGetMyProfile } from "../../interfaces/IGetMyProfile";
import { GetMyProfileDTO } from "../../dtos/user/GetMyProfileDTO";


export class GetMyProfile implements IGetMyProfile{
    constructor(private readonly _userRepository:IUserRepository){}

    async execute(request:GetMyProfileDTO):Promise<GetMyProfileResponseDTO>{
        
        const {userId} = request;
        const user = await this._userRepository.findById(userId)


        if(!user){
            throw new AppError(AUTH_MESSAGES.USER_NOT_FOUND,404);
        }

        if(!user.id){
            throw new AppError(AUTH_MESSAGES.USER_ID_IS_MISSING,500,false)
        }

        return {
            id:user.id,
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            avatar:user.avatar,
            role:user.role,
            status:user.status,
            isVerified:user.isVerified,
            createdAt:user.createdAt
        };
    }
}