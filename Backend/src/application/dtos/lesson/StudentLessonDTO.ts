
import { LessonType } from "../../../shared/enums/LessonType";

export interface StudentLessonDTO {
    lessonId: string;
    chapterId: string;
    title: string;
    description?: string;
    order: number;
    type: LessonType;
    duration?: number;

    // Signed S3 download URLs
    videoUrl?: string;
    thumbnailUrl?: string;
    attachments: string[];

    // Reading lesson content
    content?: string;
}
