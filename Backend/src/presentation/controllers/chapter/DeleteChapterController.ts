import {
    Request,
    Response,
    NextFunction,
} from "express";

import { IDeleteChapterUseCase } from "../../../application/interfaces/chapter/IDeleteChapterUseCase";

import { AppError } from "../../../shared/errors/AppError";

export class DeleteChapterController {

    constructor(
        private readonly deleteChapterUseCase: IDeleteChapterUseCase
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

            const { chapterId } = req.params;

               if (Array.isArray(chapterId)) {
                throw new AppError("Invalid course ID", 400);
            }

            await this.deleteChapterUseCase.execute(
                chapterId,
                req.user.userId
            );

            res.status(200).json({
                success: true,
                message: "Chapter deleted successfully",
                data: null,
            });

        } catch (error) {
            next(error);
        }
    }
}