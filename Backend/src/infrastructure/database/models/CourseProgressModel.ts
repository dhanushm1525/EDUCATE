
import { Document, Schema, model, Types } from "mongoose";

export interface CourseProgressDocument extends Document {
    enrollmentId: Types.ObjectId;
    userId: Types.ObjectId;
    courseId: Types.ObjectId;

    completedLessons: {
        lessonId: Types.ObjectId;
        completedAt: Date;
        watchPercentage?: number;
    }[];

    completedAssignments: {
        assignmentId: Types.ObjectId;
        submissionId: Types.ObjectId;
        completedAt: Date;
    }[];

    videoProgress: {
        lessonId: Types.ObjectId;
        watchPercentage: number;
        updatedAt: Date;
    }[];

    lastAccessedLessonId?: Types.ObjectId;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const courseProgressSchema = new Schema<CourseProgressDocument>(
    {
        enrollmentId: {
            type: Schema.Types.ObjectId,
            ref: "Enrollment",
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        courseId: {
            type: Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },

        completedLessons: {
            type: [
                {
                    lessonId: {
                        type: Schema.Types.ObjectId,
                        ref: "Lesson",
                        required: true,
                    },
                    completedAt: {
                        type: Date,
                        required: true,
                    },
                    watchPercentage: {
                        type: Number,
                        min: 0,
                        max: 100,
                    },
                },
            ],
            default: [],
        },

        completedAssignments: {
            type: [
                {
                    assignmentId: {
                        type: Schema.Types.ObjectId,
                        ref: "Assignment",
                        required: true,
                    },
                    submissionId: {
                        type: Schema.Types.ObjectId,
                        required: true,
                    },
                    completedAt: {
                        type: Date,
                        required: true,
                    },
                },
            ],
            default: [],
        },

        videoProgress: {
            type: [
                {
                    lessonId: {
                        type: Schema.Types.ObjectId,
                        ref: "Lesson",
                        required: true,
                    },
                    watchPercentage: {
                        type: Number,
                        required: true,
                        min: 0,
                        max: 100,
                    },
                    updatedAt: {
                        type: Date,
                        required: true,
                    },
                },
            ],
            default: [],
        },

        lastAccessedLessonId: {
            type: Schema.Types.ObjectId,
            ref: "Lesson",
        },

        completedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// One progress record per user per course.
courseProgressSchema.index(
    { userId: 1, courseId: 1 },
    { unique: true }
);

export const CourseProgressModel = model<CourseProgressDocument>(
    "CourseProgress",
    courseProgressSchema
);
