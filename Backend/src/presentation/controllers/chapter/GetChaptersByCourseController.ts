import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import {
    Request,
    Response,
    NextFunction,
} from "express";

import { IGetChaptersByCourseUseCase } from "../../../application/interfaces/chapter/IGetChaptersByCourseUseCase";

import { AppError } from "../../../shared/errors/AppError";

export class GetChaptersByCourseController {

    constructor(
        private readonly _getChaptersByCourseUseCase: IGetChaptersByCourseUseCase
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

            const chapters =
                await this._getChaptersByCourseUseCase.execute(
                    courseId,
                    req.user.userId
                );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Chapters fetched successfully",
                data: chapters,
            });

        } catch (error) {
            next(error);
        }
    }
}