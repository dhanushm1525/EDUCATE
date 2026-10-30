import { randomUUID } from "crypto";

import {
    ILessonMediaKeyPolicy,
    LessonMediaType,
} from "../../domain/policies/LessonMediaKeyPolicy";

export class S3LessonMediaKeyPolicy
    implements ILessonMediaKeyPolicy {

    createKey(
        courseId: string,
        chapterId: string,
        lessonId: string,
        fileName: string,
        mediaType: LessonMediaType
    ): string {
        const extension = fileName.includes(".")
            ? fileName.substring(fileName.lastIndexOf(".")).toLowerCase()
            : "";

        return `courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/${mediaType}/${randomUUID()}${extension}`;
    }

    isOwnedByLesson(
        key: string,
        courseId: string,
        chapterId: string,
        lessonId: string,
        mediaType?: LessonMediaType
    ): boolean {
        const basePrefix =
            `courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/`;

        if (mediaType) {
            return key.startsWith(`${basePrefix}${mediaType}/`);
        }

        return (
            key.startsWith(`${basePrefix}video/`) ||
            key.startsWith(`${basePrefix}thumbnail/`)
        );
    }
}