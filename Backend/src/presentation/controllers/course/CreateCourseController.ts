import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { Request, Response, NextFunction } from "express";

import { ICreateCourseUseCase } from "../../../application/interfaces/course/ICreateCourseUseCase";
import { CourseMapper } from "../../../application/mappers/CourseCreationMapper";

import { AppError } from "../../../shared/errors/AppError";

export class CreateCourseController {

    constructor(
        private readonly _createCourseUseCase: ICreateCourseUseCase
    ) { }

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            if (!req.user) {
                throw new AppError("Unauthorized", HttpStatusCode.UNAUTHORIZED);
            }

            const dto =
                CourseMapper.toCreateCourseDTO(req.body, req.user.userId);

            const course =
                await this._createCourseUseCase.execute(dto);

            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: "Course created successfully",
                data: course
            });

        } catch (error) {
            next(error);
        }
    }
}