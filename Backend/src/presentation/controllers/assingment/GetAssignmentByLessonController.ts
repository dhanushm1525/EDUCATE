import {
    Request,
    Response,
    NextFunction
} from "express";

import { IGetAssignmentByLessonUseCase }
    from "../../../application/interfaces/assingment/IGetAssignmentByLessonUseCase";
import { IIdentifierValidator }
    from "../../../application/interfaces/services/IIdentifierValidator";

import { AppError }
    from "../../../shared/errors/AppError";

import { HttpStatusCode }
    from "../../../shared/enums/HttpStatusCode";

import { AUTH_MESSAGES }
    from "../../../shared/messages/authMessages";

export class GetAssignmentByLessonController {

    constructor(
        private readonly _getAssignmentByLessonUseCase:
            IGetAssignmentByLessonUseCase,
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

            if (!this._identifierValidator.isValid(lessonId)) {
                throw new AppError(
                    "Invalid lesson ID",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            const assignment =
                await this._getAssignmentByLessonUseCase.execute(
                    lessonId,
                    req.user.userId
                );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Assignment fetched successfully",
                data: assignment,
            });

        } catch (error) {
            next(error);
        }
    }
}