
import { Request, Response, NextFunction } from "express";

import { ISaveAssignmentAnswersUseCase } from "../../../application/interfaces/assingment/ISaveAssignmentAnswersUseCase";
import { IIdentifierValidator } from "../../../application/interfaces/services/IIdentifierValidator";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AUTH_MESSAGES } from "../../../shared/messages/authMessages";

import { AssignmentSubmissionResponseMapper } from "../../../application/mappers/AssignmentSubmissionResponseMapper";

export class SaveAssignmentAnswersController {

    constructor(
        private readonly _saveAssignmentAnswersUseCase: ISaveAssignmentAnswersUseCase,
        private readonly _identifierValidator: IIdentifierValidator
    ) { }

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

            if (!Array.isArray(answers)) {
                throw new AppError(
                    "Invalid answers payload",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            // 4. Execute use case.
            const submission =
                await this._saveAssignmentAnswersUseCase.execute({
                    assignmentId,
                    userId: req.user.userId,
                    answers
                });

            // 5. Return response.
            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Assignment answers saved successfully",
                data: AssignmentSubmissionResponseMapper.toDTO(submission)
            });

        } catch (error) {
            next(error);
        }
    }
}
