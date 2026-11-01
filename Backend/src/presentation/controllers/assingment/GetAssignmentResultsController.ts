
import { Request, Response, NextFunction } from "express";

import { IGetAssignmentResultsUseCase } from "../../../application/interfaces/assingment/IGetAssignmentResultsUseCase";

import { IIdentifierValidator } from "../../../application/interfaces/services/IIdentifierValidator";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { AUTH_MESSAGES } from "../../../shared/messages/authMessages";

export class GetAssignmentResultsController {

    constructor(
        private readonly _getAssignmentResultsUseCase: IGetAssignmentResultsUseCase,
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
            const results =
                await this._getAssignmentResultsUseCase.execute(
                    assignmentId,
                    req.user.userId
                );

            // 4. Return response.
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Assignment results retrieved successfully",
                data: results
            });

        } catch (error) {
            next(error);
        }
    }
}
