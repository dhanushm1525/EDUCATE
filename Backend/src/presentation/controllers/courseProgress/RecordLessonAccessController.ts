
import { Request, Response, NextFunction } from "express";

import { IRecordLessonAccessUseCase } from "../../../application/interfaces/courseProgress/IRecordLessonAccessUseCase";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class RecordLessonAccessController {
    constructor(
        private readonly _recordLessonAccessUseCase: IRecordLessonAccessUseCase
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

            const result = await this._recordLessonAccessUseCase.execute(
                req.user.userId,
                courseIdParam,
                lessonIdParam
            );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Lesson access recorded successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}
