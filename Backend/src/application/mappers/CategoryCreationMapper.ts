import { Category } from "../../domain/entities/Category";
import { CreateCategoryDTO } from "../dtos/category/CreateCategoryDTO";
import { CategoryStatus } from "../../shared/enums/CategoryStatus";

export class CategoryCreationMapper {

    static toCreateCategoryDTO(dto: CreateCategoryDTO): CreateCategoryDTO {
        return {
            name: dto.name,
            description: dto.description,
            image: dto.image,
        };
    }

    static toEntity(dto: CreateCategoryDTO): Category {
        return {
            name: dto.name,
            description: dto.description,
            image: dto.image,

            status: CategoryStatus.ACTIVE,

            createdAt: new Date(),
            updatedAt: new Date()
        };
    }
}