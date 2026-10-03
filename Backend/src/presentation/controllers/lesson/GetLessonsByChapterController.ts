import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import {
    Request,
    Response,
    NextFunction,
} from "express";

import { AppError } from "../../../shared/errors/AppError";

import { IGetLessonsByChapterUseCase } from "../../../application/interfaces/lesson/IGetLessonsByChapterUseCase";

export class GetLessonsByChapterController {

    constructor(
        private readonly _getLessonsByChapterUseCase:
            IGetLessonsByChapterUseCase
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
            } = req.params;

             if (Array.isArray(courseId)) {
                throw new AppError("Invalid course ID", HttpStatusCode.BAD_REQUEST);
            }

             if (Array.isArray(chapterId)) {
                            throw new AppError("Invalid chapter ID", HttpStatusCode.BAD_REQUEST);
                        }

            const lessons =
                await this._getLessonsByChapterUseCase.execute(
                    courseId,
                    chapterId,
                    req.user.userId
                );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Lessons fetched successfully",
                data: lessons,
            });

        } catch (error) {
            next(error);
        }
    }
}