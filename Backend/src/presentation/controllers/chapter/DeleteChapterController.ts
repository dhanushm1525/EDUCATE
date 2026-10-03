import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import {
    Request,
    Response,
    NextFunction,
} from "express";

import { IDeleteChapterUseCase } from "../../../application/interfaces/chapter/IDeleteChapterUseCase";

import { AppError } from "../../../shared/errors/AppError";

export class DeleteChapterController {

    constructor(
        private readonly _deleteChapterUseCase: IDeleteChapterUseCase
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

            const { chapterId } = req.params;

               if (Array.isArray(chapterId)) {
                throw new AppError("Invalid course ID", HttpStatusCode.BAD_REQUEST);
            }

            await this._deleteChapterUseCase.execute(
                chapterId,
                req.user.userId
            );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Chapter deleted successfully",
                data: null,
            });

        } catch (error) {
            next(error);
        }
    }
}