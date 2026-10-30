import { Course } from "../../../domain/entities/Course";

export interface IGetTeacherCourseByIdUseCase {
    execute(
        courseId: string,
        teacherId: string
    ): Promise<Course>;
}