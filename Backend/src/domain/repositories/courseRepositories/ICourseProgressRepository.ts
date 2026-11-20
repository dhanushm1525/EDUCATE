
import { CourseProgress } from "../../entities/CourseProgress";

export interface ICourseProgressRepository {
    create(progress: CourseProgress): Promise<CourseProgress>;

    findById(progressId: string): Promise<CourseProgress | null>;

    findByEnrollmentId(
        enrollmentId: string
    ): Promise<CourseProgress | null>;

    findByUserAndCourse(
        userId: string,
        courseId: string
    ): Promise<CourseProgress | null>;

    findByUserId(userId: string): Promise<CourseProgress[]>;

    update(
        progressId: string,
        progress: Partial<CourseProgress>
    ): Promise<CourseProgress | null>;
}
