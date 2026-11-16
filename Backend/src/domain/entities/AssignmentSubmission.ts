export enum SubmissionStatus {
    IN_PROGRESS = "in_progress",
    SUBMITTED = "submitted",
    GRADED = "graded",
    EXPIRED = "expired",
}

export interface AssignmentSubmissionAnswer {
    questionId: string;
    selectedAnswer: string;
}

export interface AssignmentSubmission {
    submissionId?: string;

    assignmentId: string;
    userId: string;

    answers: AssignmentSubmissionAnswer[];

    attemptNumber: number;

    score: number;
    totalMarks: number;
    passingMarks: number;
    isPassed: boolean;

    status: SubmissionStatus;

    // Attempt timing
    startedAt?: Date;
    expiresAt?: Date;

    // Teacher grading information
    teacherFeedback?: string;
    gradedBy?: string;
    gradedAt?: Date;

    // Not present until the student submits
    submittedAt?: Date;

    createdAt: Date;
    updatedAt: Date;
}