import { Request, Response, NextFunction } from "express";

import { IGetMyTeacherApplication } from "../../../application/interfaces/teacherApplication/IGetMyTeacherApplication";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { successResponse } from "../../../shared/response/apiResponse";

export class GetMyTeacherApplicationController {

    constructor(
        private readonly _getMyTeacherApplication:
            IGetMyTeacherApplication
    ) {}

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {
            if (!req.user) {
                throw new AppError(
                    "User not authenticated",
                    HttpStatusCode.UNAUTHORIZED
                );
            }

            const result =
                await this._getMyTeacherApplication.execute(
                    req.user.userId
                );

            successResponse(
                res,
                HttpStatusCode.OK,
                result
                    ? "Teacher application retrieved successfully"
                    : "No teacher application found",
                result
            );

        } catch (error) {
            next(error);
        }
    }
}