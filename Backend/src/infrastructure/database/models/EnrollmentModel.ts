
import { Document, Schema, model, Types } from "mongoose";
import { EnrollmentStatus } from "../../../domain/entities/Enrollment";

export interface EnrollmentDocument extends Document {
    userId: Types.ObjectId;
    courseId: Types.ObjectId;
    status: EnrollmentStatus;
    enrolledAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const enrollmentSchema = new Schema<EnrollmentDocument>(
    {
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

        status: {
            type: String,
            enum: Object.values(EnrollmentStatus),
            required: true,
            default: EnrollmentStatus.PENDING,
        },

        enrolledAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate enrollment records for the same user and course.
enrollmentSchema.index(
    { userId: 1, courseId: 1 },
    { unique: true }
);

export const EnrollmentModel = model<EnrollmentDocument>(
    "Enrollment",
    enrollmentSchema
);
