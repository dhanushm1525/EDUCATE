import { Assignment } from "../../../domain/entities/Assingment";

export interface IGetAssignmentUseCase {
    execute(lessonId: string): Promise<Assignment>;
}