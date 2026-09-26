import { Request, Response, NextFunction } from "express";

import { AppError } from "../../../shared/errors/AppError";

import { CreateLessonDTO } from "../../../application/dtos/lesson/CreateLessonDTO";
import { ICreateLessonUseCase } from "../../../application/interfaces/lesson/ICreateLessonUseCase";

export class CreateLessonController {

    constructor(
        private readonly createLessonUseCase: ICreateLessonUseCase
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

            const { courseId, chapterId } = req.params;

            if (Array.isArray(chapterId)) {
                throw new AppError("Invalid chapter ID", 400);
            }

            if (Array.isArray(courseId)) {
                throw new AppError("Invalid course ID", 400);
            }

            const dto: CreateLessonDTO = {
                title: req.body.title,
                description: req.body.description,
                order: req.body.order,
                type: req.body.type,
                videoUrl: req.body.videoUrl,
                content: req.body.content,
                attachments: req.body.attachments,
                duration: req.body.duration,
            };

            const lesson =
                await this.createLessonUseCase.execute(
                    courseId,
                    chapterId,
                    req.user.userId,
                    dto
                );

            res.status(201).json({
                success: true,
                message: "Lesson created successfully",
                data: lesson,
            });

        } catch (error) {
            next(error);
        }
    }
}