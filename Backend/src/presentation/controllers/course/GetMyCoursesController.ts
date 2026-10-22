
import { Request, Response, NextFunction } from "express";

import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";

import { IGetMyCoursesUseCase } from "../../../application/interfaces/course/IGetMyCoursesUseCase";

export class GetMyCoursesController {

    constructor(
        private readonly _getMyCoursesUseCase: IGetMyCoursesUseCase
    ) { }

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

            const courses = await this._getMyCoursesUseCase.execute(
                req.user.userId
            );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Courses fetched successfully",
                data: courses
            });
        } catch (error) {
            next(error);
        }
    }
}
