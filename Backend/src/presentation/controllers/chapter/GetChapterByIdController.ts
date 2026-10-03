import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import {
    Request,
    Response,
    NextFunction,
} from "express";

import { IGetChapterByIdUseCase } from "../../../application/interfaces/chapter/IGetChapterByIdUseCase";

import { AppError } from "../../../shared/errors/AppError";

export class GetChapterByIdController {

    constructor(
        private readonly _getChapterByIdUseCase: IGetChapterByIdUseCase
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

            const { chapterId } = req.params;

            if (Array.isArray(chapterId)) {
                throw new AppError("Invalid chapter ID", HttpStatusCode.BAD_REQUEST);
            }

            const chapter =
                await this._getChapterByIdUseCase.execute(
                    chapterId,
                    req.user.userId
                );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Chapter fetched successfully",
                data: chapter,
            });

        } catch (error) {
            next(error);
        }
    }
}