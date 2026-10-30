export type LessonMediaType = "video" | "thumbnail";

export interface ILessonMediaKeyPolicy {
    createKey(
        courseId: string,
        chapterId: string,
        lessonId: string,
        fileName: string,
        mediaType: LessonMediaType
    ): string;

    isOwnedByLesson(
        key: string,
        courseId: string,
        chapterId: string,
        lessonId: string,
        mediaType?: LessonMediaType
    ): boolean;
}