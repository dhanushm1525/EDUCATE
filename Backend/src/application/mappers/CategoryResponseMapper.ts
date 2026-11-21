import { Category } from "../../domain/entities/Category";
import { CategoryResponseDTO } from "../dtos/category/CategoryResponseDTO";

export class CategoryResponseMapper {
  static toDTO(category: Category): CategoryResponseDTO {
    if (!category.categoryId) {
      throw new Error("Cannot map a category without a category ID");
    }

    return {
      categoryId: category.categoryId,
      name: category.name,
      description: category.description,
      image: category.image,
      status: category.status,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    };
  }

  static toDTOList(categories: Category[]): CategoryResponseDTO[] {
    return categories.map((category) => this.toDTO(category));
  }
}
