import { LessonMediaType } from "../../../domain/policies/LessonMediaKeyPolicy";

export interface GenerateLessonMediaUploadUrlDTO {
    fileName: string;
    contentType: string;
    mediaType: LessonMediaType;
}