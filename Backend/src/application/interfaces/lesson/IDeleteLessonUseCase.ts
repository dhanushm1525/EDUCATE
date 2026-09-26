export interface IDeleteLessonUseCase {
    execute(
        courseId: string,
        chapterId: string,
        lessonId: string,
        teacherId: string
    ): Promise<void>;
}