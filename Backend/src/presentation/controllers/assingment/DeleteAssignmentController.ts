import {
    Request,
    Response,
    NextFunction
} from "express";

import { IDeleteAssignmentUseCase } from "../../../application/interfaces/assingment/IDeleteAssignmentUseCase";
import { IIdentifierValidator } from "../../../application/interfaces/services/IIdentifierValidator";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { AUTH_MESSAGES } from "../../../shared/messages/authMessages";

export class DeleteAssignmentController {

    constructor(
        private readonly _deleteAssignmentUseCase:
            IDeleteAssignmentUseCase,
        private readonly _identifierValidator: IIdentifierValidator
    ) { }

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            if (!req.user) {
                throw new AppError(
                    AUTH_MESSAGES.AUTHENTICATION_REQUIRED,
                    HttpStatusCode.UNAUTHORIZED
                );
            }

            const { assignmentId } = req.params;

            if (Array.isArray(assignmentId)) {
                throw new AppError(
                    "Invalid assignment ID",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            if (!assignmentId) {
                throw new AppError(
                    "Assignment ID is required",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            if (!this._identifierValidator.isValid(assignmentId)) {
                throw new AppError(
                    "Invalid assignment ID",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            await this._deleteAssignmentUseCase.execute(
                assignmentId,
                req.user.userId
            );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Assignment deleted successfully"
            });

        } catch (error) {
            next(error);
        }
    }
}