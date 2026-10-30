import type { LessonType } from "../constants/lesson";

export interface Lesson {
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

export interface CreateLessonRequest {
    title: string;
    description?: string;
    order: number;
    type: LessonType;
    videoUrl?: string;
    thumbnailKey?: string;
    content?: string;
    attachments?: string[];
    duration?: number;
}

export type UpdateLessonRequest = Partial<CreateLessonRequest>;

export interface LessonApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface GenerateLessonMediaUploadUrlRequest {
    fileName: string;
    contentType: string;
    mediaType: "video" | "thumbnail";
}

export interface GenerateLessonMediaUploadUrlResponse {
    success: boolean;
    message: string;
    data: {
        uploadUrl: string;
        key: string;
    };
}