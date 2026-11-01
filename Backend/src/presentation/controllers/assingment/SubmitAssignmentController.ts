
import { Request, Response, NextFunction } from "express";

import { ISubmitAssignmentUseCase } from "../../../application/interfaces/assingment/ISubmitAssignmentUseCase";
import { IIdentifierValidator } from "../../../application/interfaces/services/IIdentifierValidator";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { AUTH_MESSAGES } from "../../../shared/messages/authMessages";

export class SubmitAssignmentController {

    constructor(
        private readonly _submitAssignmentUseCase: ISubmitAssignmentUseCase,
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

            // 3. Validate answers payload.
            const { answers } = req.body;

            if (!Array.isArray(answers) || answers.length === 0) {
                throw new AppError(
                    "At least one answer is required",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            // 4. Execute use case.
            const submission =
                await this._submitAssignmentUseCase.execute({
                    assignmentId,
                    userId: req.user.userId,
                    answers
                });

            // 5. Return response.
            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: "Assignment submitted successfully",
                data: submission
            });

        } catch (error) {
            next(error);
        }
    }
}
