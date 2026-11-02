export interface AssignmentSubmissionResultDTO {
    submissionId: string;
    assignmentId: string;
    attemptNumber: number;

    score: number;
    totalMarks: number;
    passingMarks: number;
    percentage: number;
    isPassed: boolean;

    status: string;

    teacherFeedback?: string;
    gradedAt?: Date;

    submittedAt: Date;
}