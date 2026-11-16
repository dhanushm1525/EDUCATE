import { CategoryStatus } from "../../../shared/enums/CategoryStatus";

export interface CategoryResponseDTO {
    categoryId: string;
    name: string;
    description?: string;
    image?: string;
    status: CategoryStatus;
    createdAt: string;
    updatedAt: string;
}
