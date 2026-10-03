import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import {
    Request,
    Response,
    NextFunction,
} from "express";

import { ICreateChapterUseCase } from "../../../application/interfaces/chapter/ICreateChapterUseCase";
import { ChapterCreationMapper } from "../../../application/mappers/ChapterCreationMapper";

import { AppError } from "../../../shared/errors/AppError";

export class CreateChapterController {

    constructor(
        private readonly _createChapterUseCase: ICreateChapterUseCase
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

            const { courseId } = req.params;

            if (Array.isArray(courseId)) {
                throw new AppError("Invalid course ID", HttpStatusCode.BAD_REQUEST);
            }

            const dto =
                ChapterCreationMapper.toCreateChapterDTO(req.body);

            const chapter =
                await this._createChapterUseCase.execute(
                    courseId,
                    req.user.userId,
                    dto
                );

            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: "Chapter created successfully",
                data: chapter,
            });

        } catch (error) {
            next(error);
        }
    }
}