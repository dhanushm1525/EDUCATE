import { HttpStatusCode } from "../../../../shared/enums/HttpStatusCode";

import {
    Request,
    Response,
    NextFunction
} from "express";

import { IGetCurrentUser } from "../../../../application/interfaces/auth/IGetCurrentUser";

import {
    successResponse
} from "../../../../shared/response/apiResponse";
import { AppError } from "../../../../shared/errors/AppError";
import { AuthRequestMapper } from "../../../../application/mappers/AuthRequestMapper";


export class GetCurrentUserController {

    constructor(
        private readonly _getCurrentUser:
            IGetCurrentUser
    ) { }


    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ) {

        try {

            if (!req.user) {


                throw new AppError(
                    "User not authenticated",
                    HttpStatusCode.UNAUTHORIZED
                );

            }


            const user =
                await this._getCurrentUser.execute(
                    AuthRequestMapper.toGetCurrentUserDTO(req.user.userId)
                );


            return successResponse(
                res,
                HttpStatusCode.OK,
                "Current user retrieved successfully",
                user
            );

        } catch (error) {

            next(error);

        }

    }

}