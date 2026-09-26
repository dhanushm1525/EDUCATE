import {
    Request,
    Response,
    NextFunction,
} from "express";

import { AppError } from "../../../shared/errors/AppError";

import { IGetLessonByIdUseCase } from "../../../application/interfaces/lesson/IGetLessonByIdUseCase";

export class GetLessonByIdController {

    constructor(
        private readonly getLessonByIdUseCase:
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
                    401
                );
            }

            const {
                courseId,
                chapterId,
                lessonId,
            } = req.params;

             if (Array.isArray(chapterId)) {
                throw new AppError("Invalid chapter ID", 400);
            }

             if (Array.isArray(courseId)) {
                throw new AppError("Invalid course ID", 400);
            }

             if (Array.isArray(lessonId)) {
                throw new AppError("Invalid lesson ID", 400);
            }

            const lesson =
                await this.getLessonByIdUseCase.execute(
                    courseId,
                    chapterId,
                    lessonId,
                    req.user.userId
                );

            res.status(200).json({
                success: true,
                message: "Lesson fetched successfully",
                data: lesson,
            });

        } catch (error) {
            next(error);
        }
    }
}