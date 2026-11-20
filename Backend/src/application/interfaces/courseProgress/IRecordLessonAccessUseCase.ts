
export interface IRecordLessonAccessUseCase {
    execute(
        userId: string,
        courseId: string,
        lessonId: string
    ): Promise<void>;
}

