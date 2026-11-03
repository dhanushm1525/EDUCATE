
export interface StudentLesson {
    lessonId: string;
    chapterId: string;
    title: string;
    description?: string;
    order: number;
    type: "video" | "reading";
    duration?: number;

    // Signed S3 URLs
    videoUrl?: string;
    thumbnailUrl?: string;
    attachments: string[];

    // Reading content
    content?: string;
}

export interface StudentLessonApiResponse {
    success: boolean;
    message: string;
    data: StudentLesson;
}
