
import { Request, Response, NextFunction } from "express";

import { ICompleteLessonUseCase } from "../../../application/interfaces/courseProgress/ICompleteLessonUseCase";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class CompleteLessonController {
    constructor(
        private readonly _completeLessonUseCase: ICompleteLessonUseCase
    ) {}

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.user) {
                throw new AppError(
                    "Unauthorized",
                    HttpStatusCode.UNAUTHORIZED
                );
            }

            const courseIdParam = req.params.courseId;
            const lessonIdParam = req.params.lessonId;

            if (
                typeof courseIdParam !== "string" ||
                typeof lessonIdParam !== "string"
            ) {
                throw new AppError(
                    "Invalid course or lesson ID",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            const result = await this._completeLessonUseCase.execute(
                req.user.userId,
                courseIdParam,
                lessonIdParam
            );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Lesson completed successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}
