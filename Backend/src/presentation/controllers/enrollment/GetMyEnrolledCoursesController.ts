
import { Request, Response, NextFunction } from "express";

import { IGetMyEnrolledCoursesUseCase } from "../../../application/interfaces/enrollment/IGetMyEnrolledCoursesUseCase";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class GetMyEnrolledCoursesController {
    constructor(
        private readonly _getMyEnrolledCoursesUseCase: IGetMyEnrolledCoursesUseCase
    ) {}

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.user) {
                throw new AppError(
                    "Unauthorized",
                    HttpStatusCode.UNAUTHORIZED
                );
            }

            const courses =
                await this._getMyEnrolledCoursesUseCase.execute(
                    req.user.userId
                );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Enrolled courses fetched successfully",
                data: courses,
            });
        } catch (error) {
            next(error);
        }
    }
}
