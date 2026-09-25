import {
    Document,
    Schema,
    model,
    Types,
} from "mongoose";

export interface ChapterDocument extends Document {
    courseId: Types.ObjectId;

    title: string;
    description?: string;

    order: number;
    outcomes: string[];

    createdAt: Date;
    updatedAt: Date;
}

const chapterSchema = new Schema<ChapterDocument>(
    {
        courseId: {
            type: Schema.Types.ObjectId,
            ref: "Course",
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

        outcomes: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export const ChapterModel =
    model<ChapterDocument>("Chapter", chapterSchema);