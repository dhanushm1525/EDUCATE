
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { Request, Response, NextFunction } from "express";

import { ICreateCourseUseCase } from "../../../application/interfaces/course/ICreateCourseUseCase";
import { CourseMapper } from "../../../application/mappers/CourseCreationMapper";
import { CourseResponseService } from "../../../application/services/CourseResponseService";

import { AppError } from "../../../shared/errors/AppError";

export class CreateCourseController {

    constructor(
        private readonly _createCourseUseCase: ICreateCourseUseCase,
        private readonly _courseResponseService: CourseResponseService
    ) { }

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            if (!req.user) {
                throw new AppError(
                    "Unauthorized",
                    HttpStatusCode.UNAUTHORIZED
                );
            }

            const dto =
                CourseMapper.toCreateCourseDTO(req.body, req.user.userId);

            const course =
                await this._createCourseUseCase.execute(dto);

            const responseData =
                await this._courseResponseService.toDTO(course);

            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: "Course created successfully",
                data: responseData
            });

        } catch (error) {
            next(error);
        }
    }
}
