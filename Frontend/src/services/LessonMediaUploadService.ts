
import { lessonService } from "./lesson.service";

import type {
    GenerateLessonMediaUploadUrlRequest,
} from "../types/lesson";

export interface ILessonMediaUploadService {
    upload(
        courseId: string,
        chapterId: string,
        lessonId: string,
        file: File,
        mediaType: GenerateLessonMediaUploadUrlRequest["mediaType"],
        onProgress?: (percentage: number) => void
    ): Promise<string>;
}

export class LessonMediaUploadService
    implements ILessonMediaUploadService {

    async upload(
        courseId: string,
        chapterId: string,
        lessonId: string,
        file: File,
        mediaType: GenerateLessonMediaUploadUrlRequest["mediaType"],
        onProgress?: (percentage: number) => void
    ): Promise<string> {

        const upload = await lessonService.generateMediaUploadUrl(
            courseId,
            chapterId,
            lessonId,
            {
                fileName: file.name,
                contentType: file.type,
                mediaType,
            }
        );

        await lessonService.uploadMedia(
            upload.uploadUrl,
            file,
            onProgress
        );

        return upload.key;
    }
}

export const lessonMediaUploadService =
    new LessonMediaUploadService();
