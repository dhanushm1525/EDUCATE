import { Category } from "../../../domain/entities/Category";
import { CreateCategoryDTO } from "../../dtos/category/CreateCategoryDTO";

export interface ICreateCategoryUseCase {
    execute(dto: CreateCategoryDTO): Promise<Category>;
}