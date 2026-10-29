import { Course } from "../../entities/Course";
import { CourseSearchCriteria } from "./CourseSearchCriteria";

export interface ICourseRepository {
    create(course: Course): Promise<Course>;

    findById(courseId: string): Promise<Course | null>;

    findByTeacherId(teacherId: string): Promise<Course[]>;

    findPublished(
        criteria: CourseSearchCriteria
    ): Promise<Course[]>;

    findPublishedById(
        courseId: string
    ): Promise<Course | null>;

    update(
        courseId: string,
        course: Partial<Course>
    ): Promise<Course | null>;

    delete(courseId: string): Promise<boolean>;

    incrementTotalStudents(courseId: string): Promise<boolean>;


    findPending(): Promise<Course[]>;

}