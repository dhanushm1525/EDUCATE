import { Request, Response, NextFunction } from "express";

import { IGetUsers } from "../../../application/interfaces/user/IGetUsers";
import { UserRole } from "../../../shared/enums/UserRole";
import { UserStatus } from "../../../shared/enums/UserStatus";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class GetUsersController {

    constructor(
        private readonly _getUsers: IGetUsers
    ) {}

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const page = Number(req.query.page ?? 1);
            const limit = Number(req.query.limit ?? 10);

            const role = req.query.role as UserRole | undefined;
            const status = req.query.status as UserStatus | undefined;

            const search =
                typeof req.query.search === "string"
                    ? req.query.search
                    : undefined;

            const result = await this._getUsers.execute({
                role,
                status,
                search,
                page,
                limit
            });

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Users retrieved successfully",
                data: result
            });

        } catch (error: unknown) {
            next(error);
        }
    }
}