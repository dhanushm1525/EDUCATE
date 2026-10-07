import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

import { ICreateAssignmentUseCase } from "../../../application/interfaces/assingment/ICreateAssignmentUseCase";
import { AssignmentCreationMapper } from "../../../application/mappers/AssignmentCreationMapper";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AUTH_MESSAGES } from "../../../shared/messages/authMessages";


export class CreateAssignmentController {

    constructor(
        private readonly _createAssignmentUseCase: ICreateAssignmentUseCase
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

            if(Array.isArray(lessonId)){
                throw new AppError("invalid lesson Id ",HttpStatusCode.BAD_REQUEST)
            }

            if (!lessonId) {
                throw new AppError(
                    "Lesson ID is required",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            if (!Types.ObjectId.isValid(lessonId)) {
                throw new AppError(
                    "Invalid lesson ID",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            const dto =
                AssignmentCreationMapper.toCreateAssignmentDTO({
                    ...req.body,
                    lessonId,
                });

            const assignment =
                await this._createAssignmentUseCase.execute(
                    dto,
                    req.user.userId
                );

            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: "Assignment created successfully",
                data: assignment,
            });

        } catch (error) {
            next(error);
        }
    }
}