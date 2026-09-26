import {
    Request,
    Response,
    NextFunction,
} from "express";

import { AppError } from "../../../shared/errors/AppError";

import { IDeleteLessonUseCase } from "../../../application/interfaces/lesson/IDeleteLessonUseCase";

export class DeleteLessonController {

    constructor(
        private readonly deleteLessonUseCase:
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
                    401
                );
            }

            const {
                courseId,
                chapterId,
                lessonId,
            } = req.params;

            if (Array.isArray(courseId)) {
                throw new AppError("Invalid course ID", 400);
            }

            if (Array.isArray(chapterId)) {
                throw new AppError("Invalid chapter ID", 400);
            }

            if (Array.isArray(lessonId)) {
                throw new AppError("Invalid lesson ID", 400);
            }

            await this.deleteLessonUseCase.execute(
                courseId,
                chapterId,
                lessonId,
                req.user.userId
            );

            res.status(200).json({
                success: true,
                message: "Lesson deleted successfully",
                data: null,
            });

        } catch (error) {
            next(error);
        }
    }
}