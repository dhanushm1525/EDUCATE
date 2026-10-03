import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import {
    Request,
    Response,
    NextFunction,
} from "express";

import { AppError } from "../../../shared/errors/AppError";

import { IGetLessonByIdUseCase } from "../../../application/interfaces/lesson/IGetLessonByIdUseCase";

export class GetLessonByIdController {

    constructor(
        private readonly _getLessonByIdUseCase:
            IGetLessonByIdUseCase
    ) {}

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            if (!req.user) {
                throw new AppError(
                    "Authentication required",
                    HttpStatusCode.UNAUTHORIZED
                );
            }

            const {
                courseId,
                chapterId,
                lessonId,
            } = req.params;

             if (Array.isArray(chapterId)) {
                throw new AppError("Invalid chapter ID", HttpStatusCode.BAD_REQUEST);
            }

             if (Array.isArray(courseId)) {
                throw new AppError("Invalid course ID", HttpStatusCode.BAD_REQUEST);
            }

             if (Array.isArray(lessonId)) {
                throw new AppError("Invalid lesson ID", HttpStatusCode.BAD_REQUEST);
            }

            const lesson =
                await this._getLessonByIdUseCase.execute(
                    courseId,
                    chapterId,
                    lessonId,
                    req.user.userId
                );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Lesson fetched successfully",
                data: lesson,
            });

        } catch (error) {
            next(error);
        }
    }
}