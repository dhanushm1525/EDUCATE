import {
    Request,
    Response,
    NextFunction,
} from "express";

import { IGetChaptersByCourseUseCase } from "../../../application/interfaces/chapter/IGetChaptersByCourseUseCase";

import { AppError } from "../../../shared/errors/AppError";

export class GetChaptersByCourseController {

    constructor(
        private readonly getChaptersByCourseUseCase: IGetChaptersByCourseUseCase
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
                    401
                );
            }

            const { courseId } = req.params;

            if (Array.isArray(courseId)) {
                throw new AppError("Invalid course ID", 400);
            }

            const chapters =
                await this.getChaptersByCourseUseCase.execute(
                    courseId,
                    req.user.userId
                );

            res.status(200).json({
                success: true,
                message: "Chapters fetched successfully",
                data: chapters,
            });

        } catch (error) {
            next(error);
        }
    }
}