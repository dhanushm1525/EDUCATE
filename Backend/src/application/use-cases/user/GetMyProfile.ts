import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { GetMyProfileResponseDTO } from "../../dtos/user/GetMyProfileResponseDTO";
import { AppError } from "../../../shared/errors/AppError";
import { AUTH_MESSAGES } from "../../../shared/messages/authMessages";


export class GetMyProfile{
    constructor(private readonly userRepository:IUserRepository){}

    async execute(userId:string):Promise<GetMyProfileResponseDTO>{
        
        
        const user = await this.userRepository.findById(userId)


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