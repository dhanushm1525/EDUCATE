
import { Request, Response, NextFunction } from "express";

import { IGetTeacherAssignmentsUseCase } from "../../../application/interfaces/assingment/IGetTeacherAssignmentsUseCase";
import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class GetTeacherAssignmentsController {

    constructor(
        private readonly _getTeacherAssignmentsUseCase: IGetTeacherAssignmentsUseCase
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

            const assignments =
                await this._getTeacherAssignmentsUseCase.execute(
                    req.user.userId
                );

            res.status(200).json({
                success: true,
                message: "Teacher assignments retrieved successfully",
                data: assignments
            });

        } catch (error) {
            next(error);
        }
    }
}
