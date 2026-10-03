import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { Request, Response, NextFunction } from "express";

import { ICreateCategoryUseCase } from "../../../application/interfaces/category/ICreateCategoryUseCase";
import { CategoryCreationMapper } from "../../../application/mappers/CategoryCreationMapper";

export class CreateCategoryController {
    constructor(
        private readonly _createCategoryUseCase: ICreateCategoryUseCase
    ) {}

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const dto =
                CategoryCreationMapper.toCreateCategoryDTO(req.body);

            const category =
                await this._createCategoryUseCase.execute(dto);

            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: "Category created successfully",
                data: category
            });
        } catch (error) {
            next(error);
        }
    }
}