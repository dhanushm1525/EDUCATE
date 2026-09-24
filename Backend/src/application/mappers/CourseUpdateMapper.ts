import { UpdateCourseDTO } from "../dtos/courses/UpdateCourseDTO";

export class CourseUpdateMapper {

    static toEntityUpdate(dto: UpdateCourseDTO) {
        return {
            ...dto
        };
    }
}