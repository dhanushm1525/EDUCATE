import { LessonType } from "../../../shared/enums/LessonType";

export interface CreateLessonDTO {
    title: string;
    description?: string;
    order: number;
    type: LessonType;
    videoKey?: string;
    content?: string;
    attachments?: string[];
    duration?: number;
}