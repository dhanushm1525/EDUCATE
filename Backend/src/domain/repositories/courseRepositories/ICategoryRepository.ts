import { Category } from "../../entities/Category";

export interface ICategoryRepository {
    create(category: Category): Promise<Category>;

    findById(categoryId: string): Promise<Category | null>;

    findByName(name: string): Promise<Category | null>;

    findAll(): Promise<Category[]>;

    update(
        categoryId: string,
        category: Partial<Category>
    ): Promise<Category | null>;

    delete(categoryId: string): Promise<boolean>;
}