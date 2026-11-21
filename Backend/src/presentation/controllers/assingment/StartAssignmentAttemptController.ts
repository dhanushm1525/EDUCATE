import { Request, Response, NextFunction } from "express";

import { IStartAssignmentAttemptUseCase } from "../../../application/interfaces/assingment/IStartAssignmentAttemptUseCase";
import { IIdentifierValidator } from "../../../application/interfaces/services/IIdentifierValidator";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AUTH_MESSAGES } from "../../../shared/messages/authMessages";
import { AssignmentSubmissionResponseMapper } from "../../../application/mappers/AssignmentSubmissionResponseMapper";

export class StartAssignmentAttemptController {
  constructor(
    private readonly _startAssignmentAttemptUseCase: IStartAssignmentAttemptUseCase,
    private readonly _identifierValidator: IIdentifierValidator,
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError(AUTH_MESSAGES.AUTHENTICATION_REQUIRED, HttpStatusCode.UNAUTHORIZED);
      }

      const { assignmentId } = req.params;

      if (
        !assignmentId ||
        Array.isArray(assignmentId) ||
        !this._identifierValidator.isValid(assignmentId)
      ) {
        throw new AppError("Invalid assignment ID", HttpStatusCode.BAD_REQUEST);
      }

      const attempt = await this._startAssignmentAttemptUseCase.execute(
        assignmentId,
        req.user.userId,
      );

      res.status(HttpStatusCode.OK).json({
        success: true,
        message: "Assignment attempt started successfully",
        data: AssignmentSubmissionResponseMapper.toDTO(attempt),
      });
    } catch (error) {
      next(error);
    }
  }
}
