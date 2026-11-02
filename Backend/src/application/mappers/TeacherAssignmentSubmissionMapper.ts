
import { AssignmentSubmission } from "../../domain/entities/AssignmentSubmission";
import { User } from "../../domain/entities/User";

import { TeacherAssignmentSubmissionDTO } from "../dtos/assingment/TeacherAssignmentSubmissionDTO";

export class TeacherAssignmentSubmissionMapper {

    static toDTO(
        submission: AssignmentSubmission,
        student: User
    ): TeacherAssignmentSubmissionDTO {

        if (!submission.submissionId) {
            throw new Error("Submission ID is missing");
        }

        const percentage =
            submission.totalMarks > 0
                ? Number(
                    (
                        (submission.score / submission.totalMarks) * 100
                    ).toFixed(2)
                )
                : 0;

        return {

            submissionId: submission.submissionId,

            student: {
                userId: submission.userId,
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email,
                avatar: student.avatar
            },

            attemptNumber: submission.attemptNumber,

            score: submission.score,
            totalMarks: submission.totalMarks,
            passingMarks: submission.passingMarks,

            percentage,

            isPassed: submission.isPassed,

            status: submission.status,

            submittedAt: submission.submittedAt
        };
    }
}
