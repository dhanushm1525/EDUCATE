import {
  AssignmentSubmissionAnswer,
  SubmissionStatus,
} from "../../../domain/entities/AssignmentSubmission";

export interface AssignmentSubmissionResponseDTO {
  submissionId: string;
  assignmentId: string;
  userId: string;
  answers: AssignmentSubmissionAnswer[];
  attemptNumber: number;
  score: number;
  totalMarks: number;
  passingMarks: number;
  isPassed: boolean;
  status: SubmissionStatus;
  startedAt?: string;
  expiresAt?: string;
  teacherFeedback?: string;
  gradedBy?: string;
  gradedAt?: string;
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}
