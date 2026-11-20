
export interface CompletedLesson {
    lessonId: string;
    completedAt: Date;
    watchPercentage?: number;
}

export interface CompletedAssignment {
    assignmentId: string;
    submissionId: string;
    completedAt: Date;
}

export interface VideoLessonProgress {
    lessonId: string;
    watchPercentage: number;
    updatedAt: Date;
}

export interface CourseProgress {
    progressId?: string;
    enrollmentId: string;
    userId: string;
    courseId: string;

    completedLessons: CompletedLesson[];
    completedAssignments: CompletedAssignment[];
    videoProgress: VideoLessonProgress[];

    lastAccessedLessonId?: string;
    completedAt?: Date;

    createdAt: Date;
    updatedAt: Date;
}
