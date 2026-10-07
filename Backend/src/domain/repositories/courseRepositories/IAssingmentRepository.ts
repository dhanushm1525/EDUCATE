import { Assignment } from "../../entities/Assingment";

export interface IAssignmentRepository {

    create(
        assignment: Assignment
    ): Promise<Assignment>;

    findById(
        assignmentId: string
    ): Promise<Assignment | null>;

    findByLessonId(lessonId: string): Promise<Assignment | null>;

    update(
        assignmentId: string,
        assignment: Partial<Assignment>
    ): Promise<Assignment | null>;

    delete(
        assignmentId: string
    ): Promise<boolean>;
}