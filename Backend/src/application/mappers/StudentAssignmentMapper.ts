import { Assignment } from "../../domain/entities/Assingment";
import { StudentAssignmentDTO } from "../dtos/assingment/StudentAssignmentDTO";

export class StudentAssignmentMapper {
    static toDTO(
        assignment: Assignment,
        attemptsUsed: number,
        attemptsRemaining: number | null,
        isExpired: boolean,
        canAttempt: boolean
    ): StudentAssignmentDTO {
        if (!assignment.assignmentId) {
            throw new Error(
                "Cannot map an assignment without an assignment ID"
            );
        }

        return {
            assignmentId: assignment.assignmentId,
            lessonId: assignment.lessonId,
            title: assignment.title,
            description: assignment.description,
            questions: assignment.questions.map(question => ({
                questionId: question.questionId,
                question: question.question,
                options: question.options,
                marks: question.marks,
            })),
            totalMarks: assignment.totalMarks,
            passingMarks: assignment.passingMarks,
            timeLimit: assignment.timeLimit,
            attemptsAllowed: assignment.attemptsAllowed,
            dueDate: assignment.dueDate ?? null,
            attemptsUsed,
            attemptsRemaining,
            isExpired,
            canAttempt,
        };
    }
}
