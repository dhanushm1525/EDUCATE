
import { SubmissionStatus } from "../../../domain/entities/AssignmentSubmission";

export interface TeacherSubmissionDetailDTO {

    submissionId: string;

    student: {
        userId: string;
        firstName: string;
        lastName: string;
        email: string;
        avatar?: string;
    };

    assignment: {
        assignmentId: string;
        title: string;
        totalMarks: number;
        passingMarks: number;
    };

    attemptNumber: number;

    answers: {
        questionId: string;
        question: string;
        options: string[];
        selectedAnswer: string;
        correctAnswer: string;
        marks: number;
        isCorrect: boolean;
    }[];

    score: number;
    totalMarks: number;
    passingMarks: number;
    percentage: number;
    isPassed: boolean;

    status: SubmissionStatus;

    submittedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
