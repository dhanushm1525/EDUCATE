import { Enrollment } from "../../domain/entities/Enrollment";
import { Course } from "../../domain/entities/Course";
import { EnrolledCourseDTO } from "../dtos/enrollment/EnrolledCourseDTO";

export class EnrolledCourseMapper {
    static toDTO(
        enrollment: Enrollment,
        course: Course
    ): EnrolledCourseDTO {
        if (!enrollment.enrollmentId) {
            throw new Error("Enrollment ID is missing");
        }

        return {
            enrollmentId: enrollment.enrollmentId,
            enrolledAt: enrollment.enrolledAt,
            course,
        };
    }
}