import {
    Request,
    Response,
    NextFunction,
} from "express";

import { ICreateChapterUseCase } from "../../../application/interfaces/chapter/ICreateChapterUseCase";
import { CreateChapterDTO } from "../../../application/dtos/chapter/CreateChapterDTO";

import { AppError } from "../../../shared/errors/AppError";

export class CreateChapterController {

    constructor(
        private readonly createChapterUseCase: ICreateChapterUseCase
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

            const dto: CreateChapterDTO = {
                title: req.body.title,
                description: req.body.description,
                order: req.body.order,
                outcomes: req.body.outcomes,
            };

            const chapter =
                await this.createChapterUseCase.execute(
                    courseId,
                    req.user.userId,
                    dto
                );

            res.status(201).json({
                success: true,
                message: "Chapter created successfully",
                data: chapter,
            });

        } catch (error) {
            next(error);
        }
    }
}