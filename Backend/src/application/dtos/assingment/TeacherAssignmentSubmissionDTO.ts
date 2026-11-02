
import { SubmissionStatus } from "../../../domain/entities/AssignmentSubmission";

export interface TeacherAssignmentSubmissionDTO {

    submissionId: string;

    student: {
        userId: string;
        firstName: string;
        lastName: string;
        email: string;
        avatar?: string;
    };

    attemptNumber: number;

    score: number;
    totalMarks: number;
    passingMarks: number;
    percentage: number;

    isPassed: boolean;

    status: SubmissionStatus;

    submittedAt: Date;
}
