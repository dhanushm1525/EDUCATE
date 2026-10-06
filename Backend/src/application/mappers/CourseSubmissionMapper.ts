import { SubmitCourseDTO } from "../dtos/courses/SubmitCourseDTO";

export class CourseSubmissionMapper {

    static toSubmitCourseDTO(
        courseId: string,
        teacherId: string
    ): SubmitCourseDTO {

        return {
            courseId,
            teacherId,
        };
    }
}