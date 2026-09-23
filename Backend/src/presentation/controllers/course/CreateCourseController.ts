import { Request, Response, NextFunction } from "express";

import { ICreateCourseUseCase } from "../../../application/interfaces/course/ICreateCourseUseCase";
import { CreateCourseDTO } from "../../../application/dtos/courses/CreateCourseDTO";

import { AppError } from "../../../shared/errors/AppError";

export class CreateCourseController {

    constructor(
        private readonly createCourseUseCase: ICreateCourseUseCase
    ) { }

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            if (!req.user) {
                throw new AppError("Unauthorized", 401);
            }

            const dto: CreateCourseDTO = {

                teacherId: req.user.userId,

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
                await this.createCourseUseCase.execute(dto);

            res.status(201).json({
                success: true,
                message: "Course created successfully",
                data: course
            });

        } catch (error) {
            next(error);
        }
    }
}