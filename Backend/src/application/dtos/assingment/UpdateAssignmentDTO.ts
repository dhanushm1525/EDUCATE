import { AssignmentQuestion } from "../../../domain/entities/Assingment";

export interface UpdateAssignmentDTO {
    title?: string;
    description?: string;
    questions?: AssignmentQuestion[];
    passingMarks?: number;
    timeLimit?: number;
    attemptsAllowed?: number;
}