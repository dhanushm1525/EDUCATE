import { CourseResponseDTO } from "../courses/CourseResponseDTO";

export interface EnrolledCourseResponseDTO {
    enrollmentId: string;
    enrolledAt?: string;
    course: CourseResponseDTO;
}
