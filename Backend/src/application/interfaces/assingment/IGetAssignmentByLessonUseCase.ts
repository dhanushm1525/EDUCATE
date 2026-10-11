import { Assignment } from "../../../domain/entities/Assingment";

export interface IGetAssignmentByLessonUseCase {
    execute(
        lessonId: string,
        teacherId: string
    ): Promise<Assignment | null>;
}