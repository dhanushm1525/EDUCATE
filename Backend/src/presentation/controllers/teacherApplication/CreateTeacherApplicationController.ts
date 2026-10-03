import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { Request, Response, NextFunction } from "express";

import { ICreateTeacherApplication }
    from "../../../application/interfaces/teacherApplication/ICreateTeacherApplication";

import { CreateTeacherApplicationDTO }
    from "../../../application/dtos/TeacherApplication/CreateTeacherApplicationDTO";

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

            const dto: CreateTeacherApplicationDTO = {

                qualification: req.body.qualification,

                experience: req.body.experience,

                skills: req.body.skills,

                bio: req.body.bio,

                documents: req.body.documents,

                certificates: req.body.certificates
            };

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