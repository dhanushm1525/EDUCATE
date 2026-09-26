import { LessonType } from "../../../shared/enums/LessonType";

export interface CreateLessonDTO {
    title: string;
    description?: string;
    order: number;
    type: LessonType;
    videoUrl?: string;
    content?: string;
    attachments?: string[];
    duration?: number;
}