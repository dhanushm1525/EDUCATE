
import { Assignment } from "../../domain/entities/Assingment";
import { AssignmentSubmission } from "../../domain/entities/AssignmentSubmission";
import { User } from "../../domain/entities/User";

import { TeacherSubmissionDetailDTO } from "../dtos/assingment/TeacherSubmissionDetailDTO";

export class TeacherSubmissionDetailMapper {

    static toDTO(
        submission: AssignmentSubmission,
        assignment: Assignment,
        student: User
    ): TeacherSubmissionDetailDTO {

        if (!submission.submissionId || !assignment.assignmentId) {
            throw new Error("Invalid submission or assignment data");
        }

        const questionMap = new Map(
            assignment.questions.map(question => [
                question.questionId,
                question
            ])
        );

        const answers = submission.answers.map(answer => {

            const question = questionMap.get(answer.questionId);

            if (!question) {
                throw new Error(
                    `Question not found: ${answer.questionId}`
                );
            }

            return {
                questionId: question.questionId,
                question: question.question,
                options: question.options,
                selectedAnswer: answer.selectedAnswer,
                correctAnswer: question.correctAnswer,
                marks: question.marks,
                isCorrect:
                    answer.selectedAnswer === question.correctAnswer
            };
        });

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

            assignment: {
                assignmentId: assignment.assignmentId,
                title: assignment.title,
                totalMarks: assignment.totalMarks,
                passingMarks: assignment.passingMarks
            },

            attemptNumber: submission.attemptNumber,

            answers,

            score: submission.score,
            totalMarks: submission.totalMarks,
            passingMarks: submission.passingMarks,
            percentage,
            isPassed: submission.isPassed,

            status: submission.status,

            teacherFeedback: submission.teacherFeedback,
            gradedBy: submission.gradedBy,
            gradedAt: submission.gradedAt,

            submittedAt: submission.submittedAt,
            createdAt: submission.createdAt,
            updatedAt: submission.updatedAt
        };
    }
}
