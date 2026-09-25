import { Document, Schema, model, Types } from "mongoose";
import { CourseLevel } from "../../../shared/enums/CourseLevel";
import { CourseStatus } from "../../../shared/enums/CourseStatus";

export interface CourseDocument extends Document {
    teacherId: Types.ObjectId;
    categoryId: Types.ObjectId;

    title: string;
    subtitle: string;
    description: string;

    thumbnail?: string;
    trailer?: string;

    language: string;
    level: string;

    duration: number;

    price: number;
    discount: number;
    finalPrice: number;

    tags: string[];

    objectives: string[];
    requirements: string[];

    featured: boolean;

    averageRating: number;
    totalStudents: number;

    status: string;
    rejectionReason?: string;

    createdAt: Date;
    updatedAt: Date;
}

const courseSchema = new Schema(
    {
        teacherId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        subtitle: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        thumbnail: {
            type: String,
        },

        trailer: {
            type: String,
        },

        language: {
            type: String,
            required: true,
        },

        level: {
            type: String,
            enum: Object.values(CourseLevel),
            required: true,
        },

        duration: {
            type: Number,
            required: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        discount: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },

        finalPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        tags: {
            type: [String],
            default: [],
        },

        objectives: {
            type: [String],
            default: [],
        },

        requirements: {
            type: [String],
            default: [],
        },

        featured: {
            type: Boolean,
            default: false,
        },

        averageRating: {
            type: Number,
            default: 0,
        },

        totalStudents: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: Object.values(CourseStatus),
            default: CourseStatus.DRAFT,
        },

        rejectionReason: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const CourseModel = model<CourseDocument>("Course",courseSchema);