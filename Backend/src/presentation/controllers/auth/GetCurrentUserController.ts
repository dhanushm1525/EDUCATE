import {
    Request,
    Response,
    NextFunction
} from "express";

import {
    GetCurrentUser
} from "../../../application/use-cases/auth/GetCurrentUser";

import {
    successResponse
} from "../../../shared/response/apiResponse";
import { AppError } from "../../../shared/errors/AppError";


export class GetCurrentUserController {

    constructor(
        private readonly getCurrentUser:
            GetCurrentUser
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
                    401
                );

            }


            const user =
                await this.getCurrentUser.execute(
                    req.user.userId
                );


            return successResponse(
                res,
                200,
                "Current user retrieved successfully",
                user
            );

        } catch (error) {

            next(error);

        }

    }

}