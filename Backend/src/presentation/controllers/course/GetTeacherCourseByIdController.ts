
import { Request, Response, NextFunction } from "express";

import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";

import { IGetTeacherCourseByIdUseCase } from "../../../application/interfaces/course/IGetTeacherCourseByIdUseCase";
import { CourseResponseService } from "../../../application/services/CourseResponseService";

export class GetTeacherCourseByIdController {

    constructor(
        private readonly _getTeacherCourseByIdUseCase: IGetTeacherCourseByIdUseCase,
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

            const courseId = req.params.courseId;

            if (
                typeof courseId !== "string" ||
                courseId.trim().length === 0
            ) {
                throw new AppError(
                    "A valid course ID is required",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            const course =
                await this._getTeacherCourseByIdUseCase.execute(
                    courseId,
                    req.user.userId
                );

            const responseData =
                await this._courseResponseService.toDTO(course);

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Course fetched successfully",
                data: responseData
            });

        } catch (error) {
            next(error);
        }
    }
}
