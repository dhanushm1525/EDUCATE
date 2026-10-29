
import { ApproveCourseDTO } from "../dtos/courses/ApproveCourseDTO";

export class ApproveCourseMapper {
    static toDTO(courseId: string): ApproveCourseDTO {
        return {
            courseId,
        };
    }
}
