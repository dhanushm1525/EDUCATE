import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import {
    Request,
    Response,
    NextFunction
} from "express";

import { IGenerateProfileImageUrl } from "../../../application/interfaces/user/IGenerateProfileImageUploadUrl";
import { successResponse } from "../../../shared/response/apiResponse";
import { AppError } from "../../../shared/errors/AppError";

export class GenerateProfileImageUploadUrlController {
    constructor(
        private readonly _generateProfileImageUploadUrl: IGenerateProfileImageUrl
    ) {}

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.user) {
                throw new AppError("User not authenticated", HttpStatusCode.UNAUTHORIZED);
            }

            const result = await this._generateProfileImageUploadUrl.execute({
                userId: req.user.userId,
                fileName: req.body.fileName,
                contentType: req.body.contentType
            });

            successResponse(
                res,
                HttpStatusCode.OK,
                "Profile image upload URL generated successfully",
                result
            );
        } catch (error) {
            next(error);
        }
    }
}