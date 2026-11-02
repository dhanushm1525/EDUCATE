import { AssignmentSubmission } from "../../domain/entities/AssignmentSubmission";
import { AssignmentSubmissionResultDTO } from "../dtos/assingment/AssignmentSubmissionResultDTO";

export class AssignmentSubmissionResultMapper {
    static toDTO(
        submission: AssignmentSubmission
    ): AssignmentSubmissionResultDTO {
        if (!submission.submissionId) {
            throw new Error("Submission ID is missing");
        }

        return {
            submissionId: submission.submissionId,
            assignmentId: submission.assignmentId,
            attemptNumber: submission.attemptNumber,

            score: submission.score,
            totalMarks: submission.totalMarks,
            passingMarks: submission.passingMarks,
            percentage:
                submission.totalMarks > 0
                    ? Number(
                        (
                            (submission.score / submission.totalMarks) *
                            100
                        ).toFixed(2)
                    )
                    : 0,
            isPassed: submission.isPassed,

            status: submission.status,

            teacherFeedback: submission.teacherFeedback,
            gradedAt: submission.gradedAt,

            submittedAt: submission.submittedAt,
        };
    }
}