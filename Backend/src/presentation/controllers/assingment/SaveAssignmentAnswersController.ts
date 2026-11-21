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
    private readonly _identifierValidator: IIdentifierValidator,
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Check authentication.
      if (!req.user) {
        throw new AppError(AUTH_MESSAGES.AUTHENTICATION_REQUIRED, HttpStatusCode.UNAUTHORIZED);
      }

      // 2. Extract route parameters.
      const { assignmentId, submissionId } = req.params;

      // 3. Validate assignment ID.
      if (
        !assignmentId ||
        Array.isArray(assignmentId) ||
        !this._identifierValidator.isValid(assignmentId)
      ) {
        throw new AppError("Invalid assignment ID", HttpStatusCode.BAD_REQUEST);
      }

      // 4. Validate submission ID.
      if (
        !submissionId ||
        Array.isArray(submissionId) ||
        !this._identifierValidator.isValid(submissionId)
      ) {
        throw new AppError("Invalid submission ID", HttpStatusCode.BAD_REQUEST);
      }

      // 5. Validate answers payload.
      const { answers } = req.body;

      if (!Array.isArray(answers)) {
        throw new AppError("Invalid answers payload", HttpStatusCode.BAD_REQUEST);
      }

      // 6. Execute use case.
      const submission = await this._saveAssignmentAnswersUseCase.execute({
        assignmentId,
        userId: req.user.userId,
        submissionId,
        answers,
      });

      // 7. Return response.
      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Assignment answers saved successfully",
        data: AssignmentSubmissionResponseMapper.toDTO(submission),
      });
    } catch (error) {
      next(error);
    }
  }
}
