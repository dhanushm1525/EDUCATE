import {
    Request,
    Response,
    NextFunction
} from "express";

import { Types } from "mongoose";

import { IUpdateAssignmentUseCase } from "../../../application/interfaces/assingment/IUpdateAssignmentUseCase";

import { AssignmentCreationMapper } from "../../../application/mappers/AssignmentCreationMapper";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { AUTH_MESSAGES } from "../../../shared/messages/authMessages";

export class UpdateAssignmentController {

    constructor(
        private readonly _updateAssignmentUseCase:
            IUpdateAssignmentUseCase
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

            if (!Types.ObjectId.isValid(assignmentId)) {
                throw new AppError(
                    "Invalid assignment ID",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            const dto =
                AssignmentCreationMapper.toUpdateAssignmentDTO(
                    req.body
                );

            const assignment =
                await this._updateAssignmentUseCase.execute(
                    assignmentId,
                    dto,
                    req.user.userId
                );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Assignment updated successfully",
                data: assignment,
            });

        } catch (error) {
            next(error);
        }
    }
}