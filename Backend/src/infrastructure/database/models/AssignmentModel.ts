import { Schema, model, Document, Types } from "mongoose";

export interface AssignmentQuestionDocument {
    questionId: string;
    question: string;
    options: string[];
    correctAnswer: string;
    marks: number;
}

export interface AssignmentDocument extends Document {
    _id: Types.ObjectId;

    lessonId: Types.ObjectId;

    title: string;
    description?: string;

    questions: AssignmentQuestionDocument[];

    totalMarks: number;
    passingMarks: number;

    timeLimit?: number;
    attemptsAllowed?: number;

    createdAt: Date;
    updatedAt: Date;
}

const assignmentQuestionSchema =
    new Schema<AssignmentQuestionDocument>(
        {
            questionId: {
                type: String,
                required: true,
            },

            question: {
                type: String,
                required: true,
                trim: true,
            },

            options: {
                type: [String],
                required: true,
            },

            correctAnswer: {
                type: String,
                required: true,
            },

            marks: {
                type: Number,
                required: true,
                min: 1,
            },
        },
        {
            _id: false,
        }
    );

const assignmentSchema =
    new Schema<AssignmentDocument>(
        {
            lessonId: {
                type: Schema.Types.ObjectId,
                ref: "Lesson",
                required: true,
                unique: true,
                index: true
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

            questions: {
                type: [assignmentQuestionSchema],
                required: true,
                default: [],
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

            timeLimit: {
                type: Number,
                min: 1,
            },

            attemptsAllowed: {
                type: Number,
                min: 1,
            },
        },
        {
            timestamps: true,
        }
    );

export const AssignmentModel =
    model<AssignmentDocument>(
        "Assignment",
        assignmentSchema
    );