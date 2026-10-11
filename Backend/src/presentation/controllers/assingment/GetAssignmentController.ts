import { Request, Response } from "express";

import { IGetAssignmentUseCase } from "../../../application/interfaces/assingment/IGetAssignmentUseCase";
import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AUTH_MESSAGES } from "../../../shared/messages/authMessages";

export class GetAssignmentController {
    constructor(
        private readonly _getAssignmentUseCase: IGetAssignmentUseCase
    ) {}

    async handle(
        req: Request,
        res: Response
    ): Promise<Response> {

        if (!req.user) {
            throw new AppError(
                AUTH_MESSAGES.AUTHENTICATION_REQUIRED,
                HttpStatusCode.UNAUTHORIZED
            );
        }

        const { lessonId } = req.params;

        if (Array.isArray(lessonId)) {
            throw new AppError(
                "Invalid lesson ID",
                HttpStatusCode.BAD_REQUEST
            );
        }

        if (!lessonId) {
            throw new AppError(
                "Lesson ID is required",
                HttpStatusCode.BAD_REQUEST
            );
        }

        const assignment =
            await this._getAssignmentUseCase.execute(
                lessonId,
                req.user.userId
            );

        return res.status(HttpStatusCode.OK).json({
            success: true,
            message: "Assignment fetched successfully",
            data: assignment,
        });
    }
}