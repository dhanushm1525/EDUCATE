import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

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
                    HttpStatusCode.UNAUTHORIZED
                );
            }

            const {
                courseId,
                chapterId,
                lessonId,
            } = req.params;

            if(Array.isArray(courseId)){
                throw new AppError("Invalid courseId",HttpStatusCode.BAD_REQUEST)
            }

            if(Array.isArray(chapterId)){
                throw new AppError("Invalid chapterID",HttpStatusCode.BAD_REQUEST)
            }

            if(Array.isArray(lessonId)){
                throw new AppError("Invalid lesson ID",HttpStatusCode.BAD_REQUEST)
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

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Lesson media upload URL generated successfully",
                data: result,
            });

        } catch (error) {
            next(error);
        }
    }
}