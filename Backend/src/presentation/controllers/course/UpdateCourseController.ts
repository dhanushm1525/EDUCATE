import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { Request, Response, NextFunction } from "express";

import { IUpdateCourseUseCase } from "../../../application/interfaces/course/IUpdateCourseUseCase";
import { UpdateCourseDTO } from "../../../application/dtos/courses/UpdateCourseDTO";
import { AppError } from "../../../shared/errors/AppError";

export class UpdateCourseController {
    constructor(
        private readonly _updateCourseUseCase: IUpdateCourseUseCase
    ) { }

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.user) {
                throw new AppError(
                    "Authentication required",
                    HttpStatusCode.UNAUTHORIZED
                );
            }

            const { courseId } = req.params;

            if (Array.isArray(courseId)) {
                throw new AppError("Invalid course ID", HttpStatusCode.BAD_REQUEST);
            }

            const dto: UpdateCourseDTO = {
                categoryId: req.body.categoryId,
                title: req.body.title,
                subtitle: req.body.subtitle,
                description: req.body.description,

                thumbnail: req.body.thumbnail,
                trailer: req.body.trailer,

                language: req.body.language,
                level: req.body.level,

                duration: req.body.duration,

                price: req.body.price,
                discount: req.body.discount,

                tags: req.body.tags,
                objectives: req.body.objectives,
                requirements: req.body.requirements
            };

            const course =
                await this._updateCourseUseCase.execute(
                    courseId,
                    req.user.userId,
                    dto
                );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Course updated successfully",
                data: course
            });
        } catch (error) {
            next(error);
        }
    }
}