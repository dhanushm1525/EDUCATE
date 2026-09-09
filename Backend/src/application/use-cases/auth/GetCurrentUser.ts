import {
    IUserRepository
} from "../../../domain/repositories/IUserRepository";

import {
    AppError
} from "../../../shared/errors/AppError";
import { GetCurrentUserDTO } from "../../dtos/auth/GetCurrentUserDTO";
import { GetCurrentUserResponseDTO } from "../../dtos/auth/GetCurrentUserResponseDTO";
import { IGetCurrentUser } from "../../interfaces/IGetCurrentUser";


export class GetCurrentUser implements IGetCurrentUser{

    constructor(
        private readonly userRepository:
            IUserRepository
    ) {}


    async execute(
        request:GetCurrentUserDTO
    ):Promise<GetCurrentUserResponseDTO> {
        const {userId} = request
        const user =
            await this.userRepository.findById(
                userId
            );


        if (!user) {

            throw new AppError(
                "User not found",
                404
            );

        }


        return {

            id:
                user.id,

            firstName:
                user.firstName,

            lastName:
                user.lastName,

            email:
                user.email,

            role:
                user.role

        };

    }

}