
export enum SubmissionStatus {
    SUBMITTED = "submitted",
    GRADED = "graded",
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

    // Teacher grading information
    teacherFeedback?: string;
    gradedBy?: string;
    gradedAt?: Date;

    submittedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
