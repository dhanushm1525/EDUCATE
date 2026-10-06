import { SubmitCourseDTO } from "../../dtos/courses/SubmitCourseDTO";
import { Course } from "../../../domain/entities/Course";

export interface ISubmitCourseUseCase {
    execute(dto: SubmitCourseDTO): Promise<Course>;
}