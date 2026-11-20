export interface CourseProgressDTO {
    enrollmentId: string;
    courseId: string;
    courseTitle: string;

    totalLessons: number;
    completedLessons: number;
    remainingLessons: number;

    totalRequiredAssignments: number;
    completedRequiredAssignments: number;
    remainingRequiredAssignments: number;

    progressPercentage: number;

    lastAccessedLessonId?: string;
    isCompleted: boolean;
    completedAt?: Date;

    completedLessonIds: string[];
    completedAssignmentIds: string[];
}