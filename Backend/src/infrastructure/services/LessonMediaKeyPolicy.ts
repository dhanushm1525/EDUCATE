import { randomUUID } from "crypto";

import { ILessonMediaKeyPolicy } from "../../domain/policies/LessonMediaKeyPolicy";

export class S3LessonMediaKeyPolicy
    implements ILessonMediaKeyPolicy {

    createKey(
        courseId: string,
        chapterId: string,
        lessonId: string,
        fileName: string
    ): string {

        const extension =
            fileName.includes(".")
                ? fileName.substring(fileName.lastIndexOf("."))
                : "";

        return `courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/media/${randomUUID()}${extension}`;
    }

    isOwnedByLesson(
        key: string,
        courseId: string,
        chapterId: string,
        lessonId: string
    ): boolean {

        const prefix =
            `courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/media/`;

        return key.startsWith(prefix);
    }
}