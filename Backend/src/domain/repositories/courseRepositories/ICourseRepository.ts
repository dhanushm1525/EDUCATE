import { Course } from "../../entities/Course";

export interface ICourseRepository {

    create(course: Course): Promise<Course>;

    findById(courseId: string): Promise<Course | null>;

    findByTeacherId(teacherId: string): Promise<Course[]>;

    update(courseId: string,course: Partial<Course>): Promise<Course | null>;

    delete(courseId: string): Promise<boolean>;
}