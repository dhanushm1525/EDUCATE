import { Enrollment } from "../../../domain/entities/Enrollment";

export interface IEnrollInCourseUseCase {
    execute(userId: string, courseId: string): Promise<Enrollment>;
}