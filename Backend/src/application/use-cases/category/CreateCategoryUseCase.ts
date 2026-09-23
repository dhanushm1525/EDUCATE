import { Category } from "../../../domain/entities/Category";
import { ICategoryRepository } from "../../../domain/repositories/courseRepositories/ICategoryRepository";

import { CreateCategoryDTO } from "../../dtos/category/CreateCategoryDTO";
import { CategoryCreationMapper } from "../../mappers/CategoryCreationMapper";

import { ICreateCategoryUseCase } from "../../interfaces/category/ICreateCategoryUseCase";

import { AppError } from "../../../shared/errors/AppError";

export class CreateCategoryUseCase
    implements ICreateCategoryUseCase {

    constructor(
        private readonly categoryRepository: ICategoryRepository
    ) {}

    async execute(
        dto: CreateCategoryDTO
    ): Promise<Category> {

        const existingCategory =
            await this.categoryRepository.findByName(dto.name);

        if (existingCategory) {
            throw new AppError(
                "Category already exists",
                409
            );
        }

        const category =
            CategoryCreationMapper.toEntity(dto);

        return await this.categoryRepository.create(category);
    }
}