import { Schema, model, Document, Types } from "mongoose";

import { SubmissionStatus } from "../../../domain/entities/AssignmentSubmission";

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

  startedAt?: Date;
  expiresAt?: Date;

  teacherFeedback?: string;
  gradedBy?: Types.ObjectId;
  gradedAt?: Date;

  submittedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const submissionAnswerSchema = new Schema<AssignmentSubmissionAnswerDocument>(
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
  },
);

const assignmentSubmissionSchema = new Schema<AssignmentSubmissionDocument>(
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
      default: 0,
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
      default: false,
    },

    status: {
      type: String,
      enum: Object.values(SubmissionStatus),
      required: true,
      default: SubmissionStatus.IN_PROGRESS,
    },

    startedAt: {
      type: Date,
    },

    expiresAt: {
      type: Date,
    },

    teacherFeedback: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    gradedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    gradedAt: {
      type: Date,
    },

    submittedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Efficiently retrieve a student's attempts for an assignment.
assignmentSubmissionSchema.index({
  assignmentId: 1,
  userId: 1,
  attemptNumber: 1,
});

// Allow only one IN_PROGRESS attempt per student per assignment.
assignmentSubmissionSchema.index(
  {
    assignmentId: 1,
    userId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status: SubmissionStatus.IN_PROGRESS,
    },
    name: "unique_active_assignment_attempt",
  },
);

export const AssignmentSubmissionModel = model<AssignmentSubmissionDocument>(
  "AssignmentSubmission",
  assignmentSubmissionSchema,
);
