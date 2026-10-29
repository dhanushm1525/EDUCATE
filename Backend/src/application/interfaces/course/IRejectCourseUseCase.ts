
import { Course } from "../../../domain/entities/Course";
import { RejectCourseDTO } from "../../dtos/courses/RejectCourseDTO";

export interface IRejectCourseUseCase {
    execute(dto: RejectCourseDTO): Promise<Course>;
}
