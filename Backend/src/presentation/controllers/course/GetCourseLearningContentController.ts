import { Request, Response, NextFunction } from "express";

import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";

import { IGetCourseLearningContentUseCase } from "../../../application/interfaces/course/IGetCourseLearningContentUseCase";

export class GetCourseLearningContentController {

    constructor(
        private readonly _getCourseLearningContentUseCase:
            IGetCourseLearningContentUseCase
    ) { }

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {
            const courseId = req.params.courseId;

            if (
                typeof courseId !== "string" ||
                courseId.trim().length === 0
            ) {
                throw new AppError(
                    "A valid course ID is required",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            const learningContent =
                await this._getCourseLearningContentUseCase.execute(
                    courseId
                );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Course learning content fetched successfully",
                data: learningContent,
            });

        } catch (error) {
            next(error);
        }
    }
}