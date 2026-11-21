import { AssignmentSubmission } from "../../domain/entities/AssignmentSubmission";
import { AssignmentSubmissionResponseDTO } from "../dtos/assingment/AssignmentSubmissionResponseDTO";

export class AssignmentSubmissionResponseMapper {
  static toDTO(submission: AssignmentSubmission): AssignmentSubmissionResponseDTO {
    if (!submission.submissionId) {
      throw new Error("Cannot map a submission without a submission ID");
    }

    return {
      submissionId: submission.submissionId,
      assignmentId: submission.assignmentId,
      userId: submission.userId,
      answers: submission.answers,
      attemptNumber: submission.attemptNumber,
      score: submission.score,
      totalMarks: submission.totalMarks,
      passingMarks: submission.passingMarks,
      isPassed: submission.isPassed,
      status: submission.status,
      startedAt: submission.startedAt?.toISOString(),
      expiresAt: submission.expiresAt?.toISOString(),
      teacherFeedback: submission.teacherFeedback,
      gradedBy: submission.gradedBy,
      gradedAt: submission.gradedAt?.toISOString(),
      submittedAt: submission.submittedAt?.toISOString(),
      createdAt: submission.createdAt.toISOString(),
      updatedAt: submission.updatedAt.toISOString(),
    };
  }
}
