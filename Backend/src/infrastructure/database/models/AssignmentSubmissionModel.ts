
import { Schema, model, Document, Types } from "mongoose";

import {
    SubmissionStatus,
} from "../../../domain/entities/AssignmentSubmission";

export interface AssignmentSubmissionAnswerDocument {
    questionId: string;
    selectedAnswer: string;
}

export interface AssignmentSubmissionDocument extends Document {
    _id: Types.ObjectId;

    assignmentId: Types.ObjectId;
    userId: Types.ObjectId;

    answers: AssignmentSubmissionAnswerDocument[];

    attemptNumber: number;

    score: number;
    totalMarks: number;
    passingMarks: number;
    isPassed: boolean;

    status: SubmissionStatus;

    submittedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const submissionAnswerSchema =
    new Schema<AssignmentSubmissionAnswerDocument>(
        {
            questionId: {
                type: String,
                required: true,
            },

            selectedAnswer: {
                type: String,
                required: true,
                trim: true,
            },
        },
        {
            _id: false,
        }
    );

const assignmentSubmissionSchema =
    new Schema<AssignmentSubmissionDocument>(
        {
            assignmentId: {
                type: Schema.Types.ObjectId,
                ref: "Assignment",
                required: true,
                index: true,
            },

            userId: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: true,
                index: true,
            },

            answers: {
                type: [submissionAnswerSchema],
                required: true,
                default: [],
            },

            attemptNumber: {
                type: Number,
                required: true,
                min: 1,
            },

            score: {
                type: Number,
                required: true,
                min: 0,
            },

            totalMarks: {
                type: Number,
                required: true,
                min: 1,
            },

            passingMarks: {
                type: Number,
                required: true,
                min: 1,
            },

            isPassed: {
                type: Boolean,
                required: true,
            },

            status: {
                type: String,
                enum: Object.values(SubmissionStatus),
                required: true,
                default: SubmissionStatus.SUBMITTED,
            },

            submittedAt: {
                type: Date,
                required: true,
            },
        },
        {
            timestamps: true,
        }
    );

// Efficiently retrieve a student's attempts for an assignment.
assignmentSubmissionSchema.index({
    assignmentId: 1,
    userId: 1,
    attemptNumber: 1,
});

export const AssignmentSubmissionModel =
    model<AssignmentSubmissionDocument>(
        "AssignmentSubmission",
        assignmentSubmissionSchema
    );
