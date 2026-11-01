import {
    Request,
    Response,
    NextFunction,
} from "express";

import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { AppError } from "../../../shared/errors/AppError";

import { IGenerateCourseThumbnailUploadUrlUseCase } from "../../../application/interfaces/course/IGenerateCourseThumbnailUploadUrlUseCase";

import { GenerateCourseThumbnailUploadUrlDTO } from "../../../application/dtos/courses/GenerateCourseThumbnailUploadUrlDTO";

export class GenerateCourseThumbnailUploadUrlController {

    constructor(
        private readonly _useCase: IGenerateCourseThumbnailUploadUrlUseCase
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

            const { courseId } = req.params;

            if (Array.isArray(courseId)) {
                throw new AppError(
                    "Invalid course ID",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            const dto: GenerateCourseThumbnailUploadUrlDTO = {
                contentType: req.body.contentType,
            };

            const result =
                await this._useCase.execute(
                    courseId,
                    req.user.userId,
                    dto
                );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Course thumbnail upload URL generated successfully",
                data: result,
            });

        } catch (error) {
            next(error);
        }
    }
}