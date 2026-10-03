import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

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
        private readonly _updateLessonUseCase:
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

            const dto: UpdateLessonDTO = {
                title: req.body.title,
                description: req.body.description,
                order: req.body.order,
                type: req.body.type,
                videoKey: req.body.videoUrl,
                content: req.body.content,
                attachments: req.body.attachments,
                duration: req.body.duration,
            };

            const updatedLesson =
                await this._updateLessonUseCase.execute(
                    courseId,
                    chapterId,
                    lessonId,
                    req.user.userId,
                    dto
                );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Lesson updated successfully",
                data: updatedLesson,
            });

        } catch (error) {
            next(error);
        }
    }
}