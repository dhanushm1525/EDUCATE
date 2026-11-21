import { Enrollment } from "../../domain/entities/Enrollment";
import { EnrollmentResponseDTO } from "../dtos/enrollment/EnrollmentResponseDTO";
import { EnrolledCourseDTO } from "../dtos/enrollment/EnrolledCourseDTO";
import { EnrolledCourseResponseDTO } from "../dtos/enrollment/EnrolledCourseResponseDTO";
import { CourseResponseDTO } from "../dtos/courses/CourseResponseDTO";

export class EnrollmentResponseMapper {
  static toDTO(enrollment: Enrollment): EnrollmentResponseDTO {
    if (!enrollment.enrollmentId) {
      throw new Error("Cannot map an enrollment without an enrollment ID");
    }

    return {
      enrollmentId: enrollment.enrollmentId,
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      status: enrollment.status,
      enrolledAt: enrollment.enrolledAt?.toISOString(),
      createdAt: enrollment.createdAt.toISOString(),
      updatedAt: enrollment.updatedAt.toISOString(),
    };
  }

  static toEnrolledCourseDTO(
    enrollment: EnrolledCourseDTO,
    course: CourseResponseDTO,
  ): EnrolledCourseResponseDTO {
    return {
      enrollmentId: enrollment.enrollmentId,
      enrolledAt: enrollment.enrolledAt?.toISOString(),
      course,
    };
  }
}
