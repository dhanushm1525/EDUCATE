import { Category } from "../../domain/entities/Category";
import { CategoryDocument } from "../database/models/CategoryModel";

export class CategoryPersistenceMapper {

    static toDomain(
        document: CategoryDocument
    ): Category {
        return {
            categoryId: document._id.toString(),

            name: document.name,
            description: document.description,
            image: document.image,

            status: document.status,

            createdAt: document.createdAt,
            updatedAt: document.updatedAt
        };
    }

    static toPersistence(category: Category) {
        return {
            name: category.name,
            description: category.description,
            image: category.image,
            status: category.status
        };
    }

    static toPersistenceUpdate(
        category: Partial<Category>
    ) {
        const {
            categoryId: _categoryId,
            createdAt: _createdAt,
            updatedAt: _updatedAt,
            ...updateData
        } = category;

        return updateData;
    }
}