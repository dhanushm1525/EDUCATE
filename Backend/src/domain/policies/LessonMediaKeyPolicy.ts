export interface ILessonMediaKeyPolicy {
    createKey(
        courseId: string,
        chapterId: string,
        lessonId: string,
        fileName: string
    ): string;

    isOwnedByLesson(
        key: string,
        courseId: string,
        chapterId: string,
        lessonId: string
    ): boolean;
}