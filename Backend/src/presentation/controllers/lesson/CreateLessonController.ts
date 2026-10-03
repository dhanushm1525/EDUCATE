import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { Request, Response, NextFunction } from "express";

import { AppError } from "../../../shared/errors/AppError";

import { LessonCreationMapper } from "../../../application/mappers/LessonCreationMapper";
import { ICreateLessonUseCase } from "../../../application/interfaces/lesson/ICreateLessonUseCase";

export class CreateLessonController {

    constructor(
        private readonly _createLessonUseCase: ICreateLessonUseCase
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

            const { courseId, chapterId } = req.params;

            if (Array.isArray(chapterId)) {
                throw new AppError("Invalid chapter ID", HttpStatusCode.BAD_REQUEST);
            }

            if (Array.isArray(courseId)) {
                throw new AppError("Invalid course ID", HttpStatusCode.BAD_REQUEST);
            }

            const dto =
                LessonCreationMapper.toCreateLessonDTO(req.body);

            const lesson =
                await this._createLessonUseCase.execute(
                    courseId,
                    chapterId,
                    req.user.userId,
                    dto
                );

            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: "Lesson created successfully",
                data: lesson,
            });

        } catch (error) {
            next(error);
        }
    }
}