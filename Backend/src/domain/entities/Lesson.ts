import { LessonType } from "../../shared/enums/LessonType";

export interface Lesson {
    lessonId?: string;
    chapterId: string;
    title: string;
    description?: string;
    order: number;
    type: LessonType;
    videoUrl?: string;
    content?: string;
    attachments?: string[];
    duration?: number;
    createdAt: Date;
    updatedAt: Date;
}