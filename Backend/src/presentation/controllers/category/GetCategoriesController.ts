import { Request, Response, NextFunction } from "express";
import { IGetCategoriesUseCase } from "../../../application/interfaces/category/IGetCategoriesUseCase";

export class GetCategoriesController {
    constructor(
        private readonly getCategoriesUseCase: IGetCategoriesUseCase
    ) {}

    async handle(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const categories = await this.getCategoriesUseCase.execute();

            res.status(200).json({
                success: true,
                message: "Categories fetched successfully",
                data: categories
            });
        } catch (error) {
            next(error);
        }
    }
}