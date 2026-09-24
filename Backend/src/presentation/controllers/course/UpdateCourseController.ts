import { Request, Response, NextFunction } from "express";

import { IUpdateCourseUseCase } from "../../../application/interfaces/course/IUpdateCourseUseCase";
import { UpdateCourseDTO } from "../../../application/dtos/courses/UpdateCourseDTO";
import { AppError } from "../../../shared/errors/AppError";

export class UpdateCourseController {
    constructor(
        private readonly updateCourseUseCase: IUpdateCourseUseCase
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
                    401
                );
            }

            const { courseId } = req.params;

            if (Array.isArray(courseId)) {
                throw new AppError("Invalid course ID", 400);
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
                await this.updateCourseUseCase.execute(
                    courseId,
                    req.user.userId,
                    dto
                );

            res.status(200).json({
                success: true,
                message: "Course updated successfully",
                data: course
            });
        } catch (error) {
            next(error);
        }
    }
}