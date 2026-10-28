import { Course } from "../../../domain/entities/Course";

export interface IGetPublishedCourseByIdUseCase {
    execute(courseId: string): Promise<Course | null>;
}