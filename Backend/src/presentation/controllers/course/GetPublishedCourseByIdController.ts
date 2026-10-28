
import { Request, Response, NextFunction } from "express";

import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";
import { IGetPublishedCourseByIdUseCase } from "../../../application/interfaces/course/IGetPublishedCourseByIdUseCase";
import { CourseResponseMapper } from "../../../application/mappers/CourseResponseMapper";

export class GetPublishedCourseByIdController {
    constructor(
        private readonly _getPublishedCourseByIdUseCase: IGetPublishedCourseByIdUseCase
    ) {}

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
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
                await this._getPublishedCourseByIdUseCase.execute(courseId);

            if (!course) {
                throw new AppError(
                    "Published course not found",
                    HttpStatusCode.NOT_FOUND
                );
            }

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Course fetched successfully",
                data: CourseResponseMapper.toDTO(course),
            });
        } catch (error) {
            next(error);
        }
    }
}
