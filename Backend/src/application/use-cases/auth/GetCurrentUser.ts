import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import {
    IUserRepository
} from "../../../domain/repositories/userRepositories/IUserRepository";

import {
    AppError
} from "../../../shared/errors/AppError";
import { GetCurrentUserDTO } from "../../dtos/auth/GetCurrentUserDTO";
import { GetCurrentUserResponseDTO } from "../../dtos/auth/GetCurrentUserResponseDTO";
import { IGetCurrentUser } from "../../interfaces/auth/IGetCurrentUser";


export class GetCurrentUser implements IGetCurrentUser{

    constructor(
        private readonly _userRepository:
            IUserRepository
    ) {}


    async execute(
        request:GetCurrentUserDTO
    ):Promise<GetCurrentUserResponseDTO> {
        const {userId} = request
        const user =
            await this._userRepository.findById(
                userId
            );


        if (!user) {

            throw new AppError(
                "User not found",
                HttpStatusCode.NOT_FOUND
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