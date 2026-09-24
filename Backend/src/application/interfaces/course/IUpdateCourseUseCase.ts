import { Course } from "../../../domain/entities/Course";
import { UpdateCourseDTO } from "../../dtos/courses/UpdateCourseDTO";

export interface IUpdateCourseUseCase {
    execute(
        courseId: string,
        teacherId: string,
        dto: UpdateCourseDTO
    ): Promise<Course>;
}