import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import {
    Request,
    Response,
    NextFunction,
} from "express";

import { AppError } from "../../../shared/errors/AppError";

import { IDeleteLessonUseCase } from "../../../application/interfaces/lesson/IDeleteLessonUseCase";

export class DeleteLessonController {

    constructor(
        private readonly _deleteLessonUseCase:
            IDeleteLessonUseCase
    ) { }

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

            if (Array.isArray(courseId)) {
                throw new AppError("Invalid course ID", HttpStatusCode.BAD_REQUEST);
            }

            if (Array.isArray(chapterId)) {
                throw new AppError("Invalid chapter ID", HttpStatusCode.BAD_REQUEST);
            }

            if (Array.isArray(lessonId)) {
                throw new AppError("Invalid lesson ID", HttpStatusCode.BAD_REQUEST);
            }

            await this._deleteLessonUseCase.execute(
                courseId,
                chapterId,
                lessonId,
                req.user.userId
            );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Lesson deleted successfully",
                data: null,
            });

        } catch (error) {
            next(error);
        }
    }
}