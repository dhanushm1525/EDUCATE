import { Document, Schema, model, Types } from "mongoose";
import { LessonType } from "../../../shared/enums/LessonType";

export interface LessonDocument extends Document {
    chapterId: Types.ObjectId;
    title: string;
    description?: string;
    order: number;
    type: LessonType;
    videoUrl?: string;
    content?: string;
    attachments: string[];
    duration?: number;
    createdAt: Date;
    updatedAt: Date;
}

const lessonSchema = new Schema<LessonDocument>(
    {
        chapterId: {
            type: Schema.Types.ObjectId,
            ref: "Chapter",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        order: {
            type: Number,
            required: true,
            min: 1,
        },

        type: {
            type: String,
            enum: Object.values(LessonType),
            required: true,
        },

        videoUrl: {
            type: String,
            trim: true,
        },

        content: {
            type: String,
        },

        attachments: {
            type: [String],
            default: [],
        },

        duration: {
            type: Number,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

export const LessonModel = model<LessonDocument>(
    "Lesson",
    lessonSchema
);