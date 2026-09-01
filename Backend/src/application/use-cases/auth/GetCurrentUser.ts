import {
    IUserRepository
} from "../../../domain/repositories/IUserRepository";

import {
    AppError
} from "../../../shared/errors/AppError";


export class GetCurrentUser {

    constructor(
        private readonly userRepository:
            IUserRepository
    ) {}


    async execute(
        userId: string
    ) {

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