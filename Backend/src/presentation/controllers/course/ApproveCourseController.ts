
import { Request, Response, NextFunction } from "express";

import { IApproveCourseUseCase } from "../../../application/interfaces/course/IApproveCourseUseCase";
import { ApproveCourseMapper } from "../../../application/mappers/ApproveCourseMapper";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";
import { CourseResponseService } from "../../../application/services/CourseResponseService";

export class ApproveCourseController {
    constructor(
        private readonly _approveCourseUseCase: IApproveCourseUseCase,
        private readonly _courseResponseService: CourseResponseService
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

            const dto = ApproveCourseMapper.toDTO(courseId);
            const course = await this._approveCourseUseCase.execute(dto);

            const responseData =
                await this._courseResponseService.toDTO(course);

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Course approved successfully",
                data: responseData,
            });
        } catch (error: unknown) {
            next(error);
        }
    }
}
