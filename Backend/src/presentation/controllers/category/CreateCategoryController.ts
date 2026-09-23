import { Request, Response, NextFunction } from "express";

import { ICreateCategoryUseCase } from "../../../application/interfaces/category/ICreateCategoryUseCase";
import { CreateCategoryDTO } from "../../../application/dtos/category/CreateCategoryDTO";

export class CreateCategoryController {
    constructor(
        private readonly createCategoryUseCase: ICreateCategoryUseCase
    ) {}

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const dto: CreateCategoryDTO = {
                name: req.body.name,
                description: req.body.description,
                image: req.body.image
            };

            const category =
                await this.createCategoryUseCase.execute(dto);

            res.status(201).json({
                success: true,
                message: "Category created successfully",
                data: category
            });
        } catch (error) {
            next(error);
        }
    }
}