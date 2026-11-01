
import {
    Request,
    Response,
    NextFunction
} from "express";

import { IGetStudentAssignmentUseCase }
    from "../../../application/interfaces/assingment/IGetStudentAssignmentUseCase";

import { IIdentifierValidator }
    from "../../../application/interfaces/services/IIdentifierValidator";

import { AppError }
    from "../../../shared/errors/AppError";

import { HttpStatusCode }
    from "../../../shared/enums/HttpStatusCode";

import { AUTH_MESSAGES }
    from "../../../shared/messages/authMessages";

export class GetStudentAssignmentController {

    constructor(
        private readonly _getStudentAssignmentUseCase:
            IGetStudentAssignmentUseCase,

        private readonly _identifierValidator:
            IIdentifierValidator
    ) {}

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

            const { lessonId } = req.params;

            if (
                !lessonId ||
                Array.isArray(lessonId) ||
                !this._identifierValidator.isValid(lessonId)
            ) {
                throw new AppError(
                    "Invalid lesson ID",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            const assignment =
                await this._getStudentAssignmentUseCase.execute(
                    lessonId,
                    req.user.userId
                );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Student assignment fetched successfully",
                data: assignment,
            });

        } catch (error) {
            next(error);
        }
    }
}
