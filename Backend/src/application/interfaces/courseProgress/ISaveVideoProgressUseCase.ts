
export interface ISaveVideoProgressUseCase {
    execute(
        userId: string,
        courseId: string,
        lessonId: string,
        watchPercentage: number
    ): Promise<void>;
}
