import { Request, Response, NextFunction } from "express";

import { IUpdateUserStatus } from "../../../application/interfaces/user/IUpdateUserStatus";
import { AdminUserMapper } from "../../../application/mappers/AdminUserMapper";
import { UserStatus } from "../../../shared/enums/UserStatus";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";

export class UpdateUserStatusController {

    constructor(
        private readonly _updateUserStatus: IUpdateUserStatus
    ) { }

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const userId = req.params.userId;

            if (typeof userId !== "string" || !userId.trim()) {
                throw new AppError(
                    "A valid user ID is required",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            const status = req.body.status as UserStatus;

            const user = await this._updateUserStatus.execute(
                userId,
                status
            );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: `User ${status} successfully`,
                data: AdminUserMapper.toDTO(user)
            });

        } catch (error: unknown) {
            next(error);
        }
    }
}