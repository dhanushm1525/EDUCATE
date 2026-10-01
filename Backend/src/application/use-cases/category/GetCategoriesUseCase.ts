import { Category } from "../../../domain/entities/Category";
import { ICategoryRepository } from "../../../domain/repositories/courseRepositories/ICategoryRepository";
import { IGetCategoriesUseCase } from "../../interfaces/category/IGetCategoriesUseCase";

export class GetCategoriesUseCase
    implements IGetCategoriesUseCase {

    constructor(
        private readonly _categoryRepository: ICategoryRepository
    ) {}

    async execute(): Promise<Category[]> {
        return await this._categoryRepository.findAll();
    }
}