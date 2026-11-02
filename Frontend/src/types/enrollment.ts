import type { Course } from "./course";

export interface EnrolledCourse {
    enrollmentId: string;
    enrolledAt?: string;
    course: Course;
}

export interface EnrolledCoursesResponse {
    success: boolean;
    message: string;
    data: EnrolledCourse[];
}

export interface EnrollInCourseResponse {
    success: boolean;
    message: string;
    data: EnrolledCourse | null;
}