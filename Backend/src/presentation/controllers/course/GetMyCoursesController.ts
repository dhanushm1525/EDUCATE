
import { Request, Response, NextFunction } from "express";

import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";

import { IGetMyCoursesUseCase } from "../../../application/interfaces/course/IGetMyCoursesUseCase";
import { CourseResponseService } from "../../../application/services/CourseResponseService";

export class GetMyCoursesController {
    constructor(
        private readonly _getMyCoursesUseCase: IGetMyCoursesUseCase,
        private readonly _courseResponseService: CourseResponseService
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

            const responseData =
                await this._courseResponseService.toDTOList(courses);

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Courses fetched successfully",
                data: responseData
            });
        } catch (error) {
            next(error);
        }
    }
}
