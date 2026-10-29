
import { RejectCourseDTO } from "../dtos/courses/RejectCourseDTO";

export class RejectCourseMapper {
    static toDTO(
        courseId: string,
        rejectionReason: string,
    ): RejectCourseDTO {
        return {
            courseId,
            rejectionReason,
        };
    }
}
