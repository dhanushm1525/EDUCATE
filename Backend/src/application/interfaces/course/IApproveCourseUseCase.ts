
import { Course } from "../../../domain/entities/Course";
import { ApproveCourseDTO } from "../../dtos/courses/ApproveCourseDTO";

export interface IApproveCourseUseCase {
    execute(dto: ApproveCourseDTO): Promise<Course>;
}
