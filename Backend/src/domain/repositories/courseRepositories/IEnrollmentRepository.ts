
import { Enrollment } from "../../entities/Enrollment";

export interface IEnrollmentRepository {
    create(enrollment: Enrollment): Promise<Enrollment>;

    findById(enrollmentId: string): Promise<Enrollment | null>;

    findByUserAndCourse(
        userId: string,
        courseId: string
    ): Promise<Enrollment | null>;

    findByUserId(userId: string): Promise<Enrollment[]>;

    findByCourseId(courseId: string): Promise<Enrollment[]>;

    update(
        enrollmentId: string,
        enrollment: Partial<Enrollment>
    ): Promise<Enrollment | null>;

    delete(enrollmentId: string): Promise<boolean>;
}
