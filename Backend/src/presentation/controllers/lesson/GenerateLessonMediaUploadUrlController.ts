import {
    Request,
    Response,
    NextFunction,
} from "express";

import { AppError } from "../../../shared/errors/AppError";

import { GenerateLessonMediaUploadUrlDTO } from "../../../application/dtos/lesson/GenerateLessonMediaUploadUrlDTO,";

import { IGenerateLessonMediaUploadUrlUseCase } from "../../../application/interfaces/lesson/IGenerateLessonMediaUploadUrlUseCase";

export class GenerateLessonMediaUploadUrlController {

    constructor(
        private readonly _generateLessonMediaUploadUrlUseCase:
            IGenerateLessonMediaUploadUrlUseCase
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

            if(Array.isArray(courseId)){
                throw new AppError("Invalid courseId",400)
            }

            if(Array.isArray(chapterId)){
                throw new AppError("Invalid chapterID",400)
            }

            if(Array.isArray(lessonId)){
                throw new AppError("Invalid lesson ID",400)
            }

            const dto: GenerateLessonMediaUploadUrlDTO = {
                fileName: req.body.fileName,
                contentType: req.body.contentType,
            };

            const result =
                await this._generateLessonMediaUploadUrlUseCase.execute(
                    courseId,
                    chapterId,
                    lessonId,
                    req.user.userId,
                    dto
                );

            res.status(200).json({
                success: true,
                message: "Lesson media upload URL generated successfully",
                data: result,
            });

        } catch (error) {
            next(error);
        }
    }
}