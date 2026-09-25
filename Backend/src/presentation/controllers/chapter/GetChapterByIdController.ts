import {
    Request,
    Response,
    NextFunction,
} from "express";

import { IGetChapterByIdUseCase } from "../../../application/interfaces/chapter/IGetChapterByIdUseCase";

import { AppError } from "../../../shared/errors/AppError";

export class GetChapterByIdController {

    constructor(
        private readonly getChapterByIdUseCase: IGetChapterByIdUseCase
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

            const { chapterId } = req.params;

            if (Array.isArray(chapterId)) {
                throw new AppError("Invalid chapter ID", 400);
            }

            const chapter =
                await this.getChapterByIdUseCase.execute(
                    chapterId,
                    req.user.userId
                );

            res.status(200).json({
                success: true,
                message: "Chapter fetched successfully",
                data: chapter,
            });

        } catch (error) {
            next(error);
        }
    }
}