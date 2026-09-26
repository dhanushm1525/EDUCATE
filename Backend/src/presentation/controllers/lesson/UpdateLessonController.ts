import {
    Request,
    Response,
    NextFunction,
} from "express";

import { AppError } from "../../../shared/errors/AppError";

import { UpdateLessonDTO } from "../../../application/dtos/lesson/UpdateLessonDTO";
import { IUpdateLessonUseCase } from "../../../application/interfaces/lesson/IUpdateLessonUseCase";

export class UpdateLessonController {

    constructor(
        private readonly updateLessonUseCase:
            IUpdateLessonUseCase
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

            const dto: UpdateLessonDTO = {
                title: req.body.title,
                description: req.body.description,
                order: req.body.order,
                type: req.body.type,
                videoUrl: req.body.videoUrl,
                content: req.body.content,
                attachments: req.body.attachments,
                duration: req.body.duration,
            };

            const updatedLesson =
                await this.updateLessonUseCase.execute(
                    courseId,
                    chapterId,
                    lessonId,
                    req.user.userId,
                    dto
                );

            res.status(200).json({
                success: true,
                message: "Lesson updated successfully",
                data: updatedLesson,
            });

        } catch (error) {
            next(error);
        }
    }
}