
import { Request, Response, NextFunction } from "express";

import { IApproveCourseUseCase } from "../../../application/interfaces/course/IApproveCourseUseCase";
import { ApproveCourseMapper } from "../../../application/mappers/ApproveCourseMapper";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";
import { CourseResponseMapper } from "../../../application/mappers/CourseResponseMapper";

export class ApproveCourseController {
    constructor(
        private readonly _approveCourseUseCase: IApproveCourseUseCase,
    ) { }

    async handle(
        req: Request,
        res: Response,
        next: NextFunction,
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

            if (!courseId) {
                res.status(HttpStatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "Course ID is required",
                    data: null,
                });
                return;
            }

            const dto = ApproveCourseMapper.toDTO(courseId);
            const course = await this._approveCourseUseCase.execute(dto);

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Course approved successfully",
                data: CourseResponseMapper.toDTO(course),
            });
        } catch (error: unknown) {
            next(error);
        }
    }
}
