import { Request, Response, NextFunction } from "express";

import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";

import { ICleanupLessonMediaUseCase } from "../../../application/interfaces/lesson/ICleanupLessonMediaUseCase";

export class CleanupLessonMediaController {
    constructor(
        private readonly _cleanupLessonMediaUseCase: ICleanupLessonMediaUseCase
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

            const { courseId, chapterId, lessonId } = req.params;

            if (
                Array.isArray(courseId) ||
                Array.isArray(chapterId) ||
                Array.isArray(lessonId)
            ) {
                throw new AppError(
                    "Invalid route parameters",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            await this._cleanupLessonMediaUseCase.execute(
                courseId,
                chapterId,
                lessonId,
                req.user.userId,
                req.body
            );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Unattached lesson media cleaned up successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}