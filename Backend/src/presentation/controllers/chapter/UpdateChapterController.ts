import {
    Request,
    Response,
    NextFunction,
} from "express";

import { IUpdateChapterUseCase } from "../../../application/interfaces/chapter/IUpdateChapterUseCase";
import { UpdateChapterDTO } from "../../../application/dtos/chapter/UpdateChapterDTO";

import { AppError } from "../../../shared/errors/AppError";

export class UpdateChapterController {

    constructor(
        private readonly updateChapterUseCase: IUpdateChapterUseCase
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
                throw new AppError("Invalid course ID", 400);
            }

            const dto: UpdateChapterDTO = {
                title: req.body.title,
                description: req.body.description,
                order: req.body.order,
                outcomes: req.body.outcomes,
            };

            const chapter =
                await this.updateChapterUseCase.execute(
                    chapterId,
                    req.user.userId,
                    dto
                );

            res.status(200).json({
                success: true,
                message: "Chapter updated successfully",
                data: chapter,
            });

        } catch (error) {
            next(error);
        }
    }
}