export interface LessonPreviewDTO {
    lessonId?: string;
    title: string;
    description?: string;
    order: number;
    type: string;
    duration?: number;
    thumbnailUrl?: string;
}

export interface ChapterPreviewDTO {
    chapterId?: string;
    title: string;
    description?: string;
    order: number;
    outcomes?: string[];
    lessons: LessonPreviewDTO[];
}

export interface CourseLearningContentDTO {
    chapters: ChapterPreviewDTO[];
}