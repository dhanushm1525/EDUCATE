import { Document, Schema, Types, model } from "mongoose";
import { TeacherApplicationStatus } from "../../../shared/enums/TeacherApplicationStatus";

export interface TeacherApplicationDocument extends Document {
    userId: Types.ObjectId;

    qualification: string;
    experience: number;

    skills: string[];
    bio: string;

    documents: string[];
    certificates: string[];

    status: TeacherApplicationStatus;

    rejectionReason?: string;

    createdAt: Date;
    updatedAt: Date;
}

const teacherApplicationSchema =
    new Schema<TeacherApplicationDocument>(
        {
            userId: {
                type: Types.ObjectId,
                ref: "User",
                required: true
            },

            qualification: {
                type: String,
                required: true,
                trim: true
            },

            experience: {
                type: Number,
                required: true,
                min: 0
            },

            skills: {
                type: [String],
                required: true
            },

            bio: {
                type: String,
                required: true,
                trim: true
            },

            documents: {
                type: [String],
                default: []
            },

            certificates: {
                type: [String],
                default: []
            },

            status: {
                type: String,
                enum: Object.values(TeacherApplicationStatus),
                default: TeacherApplicationStatus.PENDING,
                required: true
            },

            rejectionReason: {
                type: String,
                trim: true
            }
        },
        {
            timestamps: true
        }
    );

export const TeacherApplicationModel =
    model<TeacherApplicationDocument>(
        "TeacherApplication",
        teacherApplicationSchema
    );