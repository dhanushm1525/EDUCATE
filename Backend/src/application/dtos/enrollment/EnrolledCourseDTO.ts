
import { Course } from "../../../domain/entities/Course";

export interface EnrolledCourseDTO {
    enrollmentId: string;
    enrolledAt?: Date;
    course: Course;
}
