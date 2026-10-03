import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { Request, Response, NextFunction } from "express";

import { IUpdateProfileImage } from "../../../application/interfaces/user/IUpdateProfileImage";
import { AppError } from "../../../shared/errors/AppError";
import { successResponse } from "../../../shared/response/apiResponse";
import { UserRequestMapper } from "../../../application/mappers/UserRequestMapper";

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
                throw new AppError("User not authenticated", HttpStatusCode.UNAUTHORIZED);
            }

            const dto = UserRequestMapper.toUpdateProfileImageDTO(
                req.user.userId,
                req.body
            );

            const result = await this._updateProfileImage.execute(dto);

            successResponse(
                res,
                HttpStatusCode.OK,
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