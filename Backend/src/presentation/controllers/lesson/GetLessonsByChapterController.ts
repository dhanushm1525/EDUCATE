import {
    Request,
    Response,
    NextFunction,
} from "express";

import { AppError } from "../../../shared/errors/AppError";

import { IGetLessonsByChapterUseCase } from "../../../application/interfaces/lesson/IGetLessonsByChapterUseCase";

export class GetLessonsByChapterController {

    constructor(
        private readonly getLessonsByChapterUseCase:
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
                    401
                );
            }

            const {
                courseId,
                chapterId,
            } = req.params;

             if (Array.isArray(courseId)) {
                throw new AppError("Invalid course ID", 400);
            }

             if (Array.isArray(chapterId)) {
                            throw new AppError("Invalid chapter ID", 400);
                        }

            const lessons =
                await this.getLessonsByChapterUseCase.execute(
                    courseId,
                    chapterId,
                    req.user.userId
                );

            res.status(200).json({
                success: true,
                message: "Lessons fetched successfully",
                data: lessons,
            });

        } catch (error) {
            next(error);
        }
    }
}