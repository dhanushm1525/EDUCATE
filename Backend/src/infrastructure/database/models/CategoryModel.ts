import { Document, Schema, model } from "mongoose";
import { CategoryStatus } from "../../../shared/enums/CategoryStatus";

export interface CategoryDocument extends Document {
    name: string;
    description?: string;
    image?: string;
    status: CategoryStatus;
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema = new Schema<CategoryDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },

        description: {
            type: String,
            trim: true
        },

        image: {
            type: String
        },

        status: {
            type: String,
            enum: Object.values(CategoryStatus),
            default: CategoryStatus.ACTIVE,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const CategoryModel =
    model<CategoryDocument>("Category", categorySchema);