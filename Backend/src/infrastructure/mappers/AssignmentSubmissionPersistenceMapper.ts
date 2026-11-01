
import {
    AssignmentSubmission,
} from "../../domain/entities/AssignmentSubmission";

import {
    AssignmentSubmissionDocument,
} from "../database/models/AssignmentSubmissionModel";

export class AssignmentSubmissionPersistenceMapper {

    static toPersistence(submission: AssignmentSubmission) {
        return {
            assignmentId: submission.assignmentId,
            userId: submission.userId,

            answers: submission.answers.map(answer => ({
                questionId: answer.questionId,
                selectedAnswer: answer.selectedAnswer,
            })),

            attemptNumber: submission.attemptNumber,

            score: submission.score,
            totalMarks: submission.totalMarks,
            passingMarks: submission.passingMarks,
            isPassed: submission.isPassed,

            status: submission.status,

            submittedAt: submission.submittedAt,
        };
    }

    static toDomain(
        document: AssignmentSubmissionDocument
    ): AssignmentSubmission {

        return {
            submissionId: document._id.toString(),

            assignmentId: document.assignmentId.toString(),
            userId: document.userId.toString(),

            answers: document.answers.map(answer => ({
                questionId: answer.questionId,
                selectedAnswer: answer.selectedAnswer,
            })),

            attemptNumber: document.attemptNumber,

            score: document.score,
            totalMarks: document.totalMarks,
            passingMarks: document.passingMarks,
            isPassed: document.isPassed,

            status: document.status,

            submittedAt: document.submittedAt,

            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        };
    }
}
