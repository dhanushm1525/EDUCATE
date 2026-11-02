
import { Request, Response, NextFunction } from "express";

import { IGetTeacherAssignmentSubmissionsUseCase } from "../../../application/interfaces/assingment/IGetTeacherAssignmentSubmissionsUseCase";

import { IIdentifierValidator } from "../../../application/interfaces/services/IIdentifierValidator";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { AUTH_MESSAGES } from "../../../shared/messages/authMessages";


export class GetTeacherAssignmentSubmissionsController {

    constructor(
        private readonly _getTeacherAssignmentSubmissionsUseCase: IGetTeacherAssignmentSubmissionsUseCase,
        private readonly _identifierValidator: IIdentifierValidator
    ) {}

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            // 1. Check authentication.
            if (!req.user) {
                throw new AppError(
                    AUTH_MESSAGES.AUTHENTICATION_REQUIRED,
                    HttpStatusCode.UNAUTHORIZED
                );
            }

            // 2. Validate assignment ID.
            const { assignmentId } = req.params;

            if (
                !assignmentId ||
                Array.isArray(assignmentId) ||
                !this._identifierValidator.isValid(assignmentId)
            ) {
                throw new AppError(
                    "Invalid assignment ID",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            // 3. Execute use case.
            const submissions =
                await this._getTeacherAssignmentSubmissionsUseCase.execute(
                    assignmentId,
                    req.user.userId
                );

            // 4. Return response.
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Assignment submissions retrieved successfully",
                data: submissions
            });

        } catch (error) {
            next(error);
        }
    }
}
