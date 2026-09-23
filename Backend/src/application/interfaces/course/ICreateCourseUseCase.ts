import { Course } from "../../../domain/entities/Course";
import { CreateCourseDTO } from "../../dtos/courses/CreateCourseDTO";

export interface ICreateCourseUseCase {
    execute(dto: CreateCourseDTO): Promise<Course>;
}