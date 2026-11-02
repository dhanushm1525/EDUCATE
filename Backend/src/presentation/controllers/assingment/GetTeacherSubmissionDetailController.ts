
import { Request, Response, NextFunction } from "express";

import { IGetTeacherSubmissionDetailUseCase } from "../../../application/interfaces/assingment/IGetTeacherSubmissionDetailUseCase";

import { IIdentifierValidator } from "../../../application/interfaces/services/IIdentifierValidator";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { AUTH_MESSAGES } from "../../../shared/messages/authMessages";


export class GetTeacherSubmissionDetailController {

    constructor(
        private readonly _getTeacherSubmissionDetailUseCase: IGetTeacherSubmissionDetailUseCase,
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

            // 2. Extract route parameters.
            const { assignmentId, submissionId } = req.params;

            // 3. Validate assignment ID.
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

            // 4. Validate submission ID.
            if (
                !submissionId ||
                Array.isArray(submissionId) ||
                !this._identifierValidator.isValid(submissionId)
            ) {
                throw new AppError(
                    "Invalid submission ID",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            // 5. Execute use case.
            const submission =
                await this._getTeacherSubmissionDetailUseCase.execute(
                    assignmentId,
                    submissionId,
                    req.user.userId
                );

            // 6. Return response.
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Submission details retrieved successfully",
                data: submission
            });

        } catch (error) {
            next(error);
        }
    }
}
