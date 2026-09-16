import { Request, Response, NextFunction } from "express";

import { IUpdateProfileImage } from "../../../application/interfaces/IUpdateProfileImage";
import { AppError } from "../../../shared/errors/AppError";
import { successResponse } from "../../../shared/response/apiResponse";

export class UpdateProfileImageController {
    constructor(
        private readonly _updateProfileImage: IUpdateProfileImage
    ) {}

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.user) {
                throw new AppError("User not authenticated", 401);
            }

            const result = await this._updateProfileImage.execute({
                userId: req.user.userId,
                avatarKey: req.body.avatarKey
            });

            successResponse(
                res,
                200,
                "Profile image updated successfully",
                {
                    avatar: result.avatar
                }
            );
        } catch (error) {
            next(error);
        }
    }
}