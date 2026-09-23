import { Category } from "../../../domain/entities/Category";

export interface IGetCategoriesUseCase {
    execute(): Promise<Category[]>;
}