import { ICategoryRepository } from "../../domain/repositories/courseRepositories/ICategoryRepository";
import { Category } from "../../domain/entities/Category";

import { BaseRepository } from "./BaseRepository";

import {
    CategoryDocument,
    CategoryModel
} from "../database/models/CategoryModel";

import { CategoryPersistenceMapper } from "../mappers/CategoryPersistanceMapper";

export class MongoCategoryRepository
    extends BaseRepository<CategoryDocument>
    implements ICategoryRepository {

    constructor() {
        super(CategoryModel);
    }

    async create(
        category: Category
    ): Promise<Category> {

        const documentData =
            CategoryPersistenceMapper.toPersistence(category);

        const document =
            await this.createDocument(documentData);

        return CategoryPersistenceMapper.toDomain(document);
    }

    async findById(
        categoryId: string
    ): Promise<Category | null> {

        const document =
            await this.findByIdDocument(categoryId);

        if (!document) {
            return null;
        }

        return CategoryPersistenceMapper.toDomain(document);
    }

    async findByName(
        name: string
    ): Promise<Category | null> {

        const document =
            await this.findOneDocument({
                name: {
                    $regex: `^${name}$`,
                    $options: "i"
                }
            });

        if (!document) {
            return null;
        }

        return CategoryPersistenceMapper.toDomain(document);
    }

    async findAll(): Promise<Category[]> {

        const documents =
            await this.findManyDocuments();

        return documents.map(
            CategoryPersistenceMapper.toDomain
        );
    }

    async update(
        categoryId: string,
        category: Partial<Category>
    ): Promise<Category | null> {

        const updateData =
            CategoryPersistenceMapper.toPersistenceUpdate(
                category
            );

        const document =
            await this.updateByIdDocument(
                categoryId,
                updateData
            );

        if (!document) {
            return null;
        }

        return CategoryPersistenceMapper.toDomain(document);
    }

    async delete(
        categoryId: string
    ): Promise<boolean> {

        return await this.deleteByIdDocument(categoryId);
    }
}