import { LessonType } from "../../../shared/enums/LessonType";

export interface LessonResponseDTO {
    lessonId: string;
    chapterId: string;
    title: string;
    description?: string;
    order: number;
    type: LessonType;
    videoKey?: string;
    thumbnailKey?: string;
    content?: string;
    attachments?: string[];
    duration?: number;
    createdAt: string;
    updatedAt: string;
}
