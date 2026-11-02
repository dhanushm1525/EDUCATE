export interface StudentAssignmentQuestion {
    questionId: string;
    question: string;
    options: string[];
    marks: number;
}

export interface StudentAssignment {
    assignmentId: string;
    lessonId: string;
    title: string;
    description?: string;

    questions: StudentAssignmentQuestion[];

    totalMarks: number;
    passingMarks: number;

    timeLimit?: number;
    attemptsAllowed?: number;
    dueDate?: string | null;

    attemptsUsed: number;
    attemptsRemaining: number | null;

    isExpired: boolean;
    canAttempt: boolean;
}

export interface StudentAssignmentResponse {
    success: boolean;
    message: string;
    data: StudentAssignment;
}

export interface SubmitAssignmentAnswer {
    questionId: string;
    selectedAnswer: string;
}

export interface SubmitAssignmentRequest {
    answers: SubmitAssignmentAnswer[];
}

export interface AssignmentSubmissionResult {
    submissionId: string;
    assignmentId: string;
    attemptNumber: number;

    score: number;
    totalMarks: number;
    passingMarks: number;
    percentage: number;
    isPassed: boolean;

    status: "submitted" | "graded";

    teacherFeedback?: string;
    gradedAt?: string;

    submittedAt: string;
}

export interface AssignmentResultsResponse {
    success: boolean;
    message: string;
    data: AssignmentSubmissionResult[];
}

export interface SubmitAssignmentResponse {
    success: boolean;
    message: string;
    data: unknown;
}