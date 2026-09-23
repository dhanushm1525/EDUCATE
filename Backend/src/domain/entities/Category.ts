import { CategoryStatus } from "../../shared/enums/CategoryStatus";

export interface Category {
    categoryId?: string;

    name: string;
    description?: string;
    image?: string;

    status: CategoryStatus;

    createdAt: Date;
    updatedAt: Date;
}