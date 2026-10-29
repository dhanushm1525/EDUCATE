import { Request, Response, NextFunction } from "express";

import { IRejectCourseUseCase } from "../../../application/interfaces/course/IRejectCourseUseCase";
import { RejectCourseMapper } from "../../../application/mappers/RejectCourseMapper";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";
import { CourseResponseMapper } from "../../../application/mappers/CourseResponseMapper";

export class RejectCourseController {
    constructor(
        private readonly _rejectCourseUseCase: IRejectCourseUseCase
    ) {}

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { courseId } = req.params;
            const { rejectionReason } = req.body;

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

            if (
                typeof rejectionReason !== "string" ||
                !rejectionReason.trim()
            ) {
                res.status(HttpStatusCode.BAD_REQUEST).json({
                    success: false,
                    message: "A rejection reason is required",
                    data: null,
                });
                return;
            }

            const dto = RejectCourseMapper.toDTO(
                courseId,
                rejectionReason
            );

            const course = await this._rejectCourseUseCase.execute(dto);

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Course rejected successfully",
                data: CourseResponseMapper.toDTO(course),
            });
        } catch (error: unknown) {
            next(error);
        }
    }
}