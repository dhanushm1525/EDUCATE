import { Course } from "../../../domain/entities/Course";

export interface IGetMyCoursesUseCase {
    execute(teacherId: string): Promise<Course[]>;
}