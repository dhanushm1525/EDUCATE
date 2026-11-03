import {
    Request,
    Response,
    NextFunction
} from "express";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { successResponse } from "../../../shared/response/apiResponse";

import { IGenerateTeacherApplicationUploadUrl } from "../../../application/interfaces/teacherApplication/IGenerateTeacherApplicationUploadUrl";

export class GenerateTeacherApplicationUploadUrlController {

    constructor(
        private readonly _generateUploadUrl:
            IGenerateTeacherApplicationUploadUrl
    ) { }

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {
            if (!req.user) {
                throw new AppError(
                    "User not authenticated",
                    HttpStatusCode.UNAUTHORIZED
                );
            }

            const result = await this._generateUploadUrl.execute({
                userId: req.user.userId,
                fileType: req.body.fileType,
                contentType: req.body.contentType
            });

            successResponse(
                res,
                HttpStatusCode.OK,
                "Teacher application upload URL generated successfully",
                result
            );

        } catch (error) {
            next(error);
        }
    }
}