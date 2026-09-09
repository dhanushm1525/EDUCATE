import {
    Request,
    Response,
    NextFunction
} from "express";

import { IGetCurrentUser } from "../../../application/interfaces/IGetCurrentUser";

import {
    successResponse
} from "../../../shared/response/apiResponse";
import { AppError } from "../../../shared/errors/AppError";


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
                    401
                );

            }


            const user =
                await this._getCurrentUser.execute(
                    {userId:req.user.userId}
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