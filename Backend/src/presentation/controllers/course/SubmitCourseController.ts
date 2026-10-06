import { Request, Response, NextFunction } from "express";

import { ISubmitCourseUseCase } from "../../../application/interfaces/course/ISubmitCourseUseCase";

import { CourseSubmissionMapper } from "../../../application/mappers/CourseSubmissionMapper";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { AUTH_MESSAGES } from "../../../shared/messages/authMessages";
import { COURSE_MESSAGES } from "../../../shared/messages/courseMessages";

export class SubmitCourseController {

    constructor(
        private readonly _submitCourseUseCase: ISubmitCourseUseCase
    ) {}

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

            if(Array.isArray(courseId)){
                throw new AppError(COURSE_MESSAGES.COURSE_NOT_FOUND,HttpStatusCode.NOT_FOUND)
            }

            if (!courseId) {
                throw new AppError(
                    "Course ID is required",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            const dto =
                CourseSubmissionMapper.toSubmitCourseDTO(
                    courseId,
                    req.user.userId
                );

            const course =
                await this._submitCourseUseCase.execute(dto);

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: COURSE_MESSAGES.COURSE_SUBMITTED,
                data: course,
            });

        } catch (error) {
            next(error);
        }
    }
}