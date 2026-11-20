import { Request, Response, NextFunction } from "express";

import { ISaveVideoProgressUseCase } from "../../../application/interfaces/courseProgress/ISaveVideoProgressUseCase";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class SaveVideoProgressController {
    constructor(
        private readonly _saveVideoProgressUseCase: ISaveVideoProgressUseCase
    ) {}

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.user) {
                throw new AppError(
                    "Unauthorized",
                    HttpStatusCode.UNAUTHORIZED
                );
            }

            const courseId = req.params.courseId;
            const lessonId = req.params.lessonId;
            const { watchPercentage } = req.body;

            if (
                typeof courseId !== "string" ||
                typeof lessonId !== "string"
            ) {
                throw new AppError(
                    "Invalid course or lesson ID",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            if (
                typeof watchPercentage !== "number" ||
                !Number.isFinite(watchPercentage)
            ) {
                throw new AppError(
                    "Valid watch percentage is required",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            await this._saveVideoProgressUseCase.execute(
                req.user.userId,
                courseId,
                lessonId,
                watchPercentage
            );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Video progress saved successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}