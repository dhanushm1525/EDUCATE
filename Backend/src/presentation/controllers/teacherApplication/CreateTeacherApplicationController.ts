import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { Request, Response, NextFunction } from "express";

import { ICreateTeacherApplication }
    from "../../../application/interfaces/teacherApplication/ICreateTeacherApplication";

import { TeacherApplicationCreationMapper }
    from "../../../application/mappers/TeacherApplicationCreationMapper";

import { successResponse }
    from "../../../shared/response/apiResponse";
import { AppError } from "../../../shared/errors/AppError";


export class CreateTeacherApplicationController {

    constructor(
        private readonly _createTeacherApplication:
            ICreateTeacherApplication
    ) { }

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ) {

        try {

            const dto =
                TeacherApplicationCreationMapper
                    .toCreateTeacherApplicationDTO(req.body);

            if (!req.user) {
                throw new AppError(
                    "Authentication required",
                    HttpStatusCode.UNAUTHORIZED
                );
            }

            const userId = req.user.userId;

            const result =
                await this._createTeacherApplication.execute(
                    userId,
                    dto
                );

            return successResponse(
                res,
                HttpStatusCode.CREATED,
                "Teacher application submitted successfully",
                result
            );

        } catch (error) {

            next(error);

        }
    }
}