import { Request, Response, NextFunction } from "express";

import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";

import { IGetTeacherCourseByIdUseCase } from "../../../application/interfaces/course/IGetTeacherCourseByIdUseCase";
import { CourseResponseMapper } from "../../../application/mappers/CourseResponseMapper";

export class GetTeacherCourseByIdController {

    constructor(
        private readonly _getTeacherCourseByIdUseCase: IGetTeacherCourseByIdUseCase
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

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Course fetched successfully",
                data: CourseResponseMapper.toDTO(course)
            });

        } catch (error) {
            next(error);
        }
    }
}