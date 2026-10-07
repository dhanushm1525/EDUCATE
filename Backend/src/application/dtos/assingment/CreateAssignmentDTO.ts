import { AssignmentQuestion } from "../../../domain/entities/Assingment";

export interface CreateAssignmentDTO {
    lessonId: string;
    title: string;
    description?: string;
    questions: AssignmentQuestion[];
    passingMarks: number;
    timeLimit?: number;
    attemptsAllowed?: number;
}