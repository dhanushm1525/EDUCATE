import { CleanupLessonMediaDTO } from "../../dtos/lesson/CleanupLessonMediaDTO";

export interface ICleanupLessonMediaUseCase {
    execute(
        courseId: string,
        chapterId: string,
        lessonId: string,
        teacherId: string,
        dto: CleanupLessonMediaDTO
    ): Promise<void>;
}