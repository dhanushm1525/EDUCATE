import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { Request, Response, NextFunction } from "express";

import { IUpdateCourseUseCase } from "../../../application/interfaces/course/IUpdateCourseUseCase";
import { CourseUpdateMapper } from "../../../application/mappers/CourseUpdateMapper";
import { AppError } from "../../../shared/errors/AppError";
import { AUTH_MESSAGES } from "../../../shared/messages/authMessages";

export class UpdateCourseController {
    constructor(
        private readonly _updateCourseUseCase: IUpdateCourseUseCase
    ) { }

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.user) {
                throw new AppError(
                    AUTH_MESSAGES.AUTHENTICATION_REQUIRED,
                    HttpStatusCode.UNAUTHORIZED
                );
            }

            const { courseId } = req.params;

            if (Array.isArray(courseId)) {
                throw new AppError("Invalid course ID", HttpStatusCode.BAD_REQUEST);
            }

            const dto =
                CourseUpdateMapper.toUpdateCourseDTO(req.body);

            const course =
                await this._updateCourseUseCase.execute(
                    courseId,
                    req.user.userId,
                    dto
                );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Course updated successfully",
                data: course
            });
        } catch (error) {
            next(error);
        }
    }
}