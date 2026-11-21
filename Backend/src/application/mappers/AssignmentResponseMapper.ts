import { Assignment } from "../../domain/entities/Assingment";
import { AssignmentResponseDTO } from "../dtos/assingment/AssignmentResponseDTO";

export class AssignmentResponseMapper {
  static toDTO(assignment: Assignment | null): AssignmentResponseDTO | null {
    if (!assignment) {
      return null;
    }

    if (!assignment.assignmentId) {
      throw new Error("Cannot map an assignment without an assignment ID");
    }

    return {
      assignmentId: assignment.assignmentId,
      lessonId: assignment.lessonId,
      title: assignment.title,
      description: assignment.description,
      questions: assignment.questions.map((question) => ({
        questionId: question.questionId,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        marks: question.marks,
      })),
      totalMarks: assignment.totalMarks,
      passingMarks: assignment.passingMarks,
      timeLimit: assignment.timeLimit,
      attemptsAllowed: assignment.attemptsAllowed,
      dueDate:
        assignment.dueDate === undefined
          ? undefined
          : assignment.dueDate === null
            ? null
            : assignment.dueDate.toISOString(),
      createdAt: assignment.createdAt.toISOString(),
      updatedAt: assignment.updatedAt.toISOString(),
    };
  }
}
