
export interface CourseProgress {
    enrollmentId: string;
    courseId: string;
    courseTitle: string;
    totalLessons: number;
    completedLessons: number;
    remainingLessons: number;
    progressPercentage: number;
    lastAccessedLessonId?: string;
    isCompleted: boolean;
    completedAt?: Date;
    completedLessonIds: string[];
}

export interface CourseProgressApiResponse {
    success: boolean;
    message: string;
    data: CourseProgress[];
}

export interface SingleCourseProgressApiResponse {
    success: boolean;
    message: string;
    data: CourseProgress;
}
