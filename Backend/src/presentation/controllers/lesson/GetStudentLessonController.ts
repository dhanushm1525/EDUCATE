
import { Request, Response, NextFunction } from "express";

import { IGetStudentLessonUseCase } from "../../../application/interfaces/lesson/IGetStudentLessonUseCase";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class GetStudentLessonController {
    constructor(
        private readonly _getStudentLessonUseCase: IGetStudentLessonUseCase
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

            const { courseId, chapterId, lessonId } = req.params;

            if (
                typeof courseId !== "string" ||
                typeof chapterId !== "string" ||
                typeof lessonId !== "string"
            ) {
                throw new AppError(
                    "Invalid course, chapter or lesson ID",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            const lesson = await this._getStudentLessonUseCase.execute(
                courseId,
                chapterId,
                lessonId,
                req.user.userId
            );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Student lesson fetched successfully",
                data: lesson
            });
        } catch (error) {
            next(error);
        }
    }
}
