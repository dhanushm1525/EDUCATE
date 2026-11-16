import { EnrollmentStatus } from "../../../domain/entities/Enrollment";

export interface EnrollmentResponseDTO {
    enrollmentId: string;
    userId: string;
    courseId: string;
    status: EnrollmentStatus;
    enrolledAt?: string;
    createdAt: string;
    updatedAt: string;
}
