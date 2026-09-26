import { Lesson } from "../../../domain/entities/Lesson";

export interface IGetLessonByIdUseCase {
    execute(
        courseId: string,
        chapterId: string,
        lessonId: string,
        teacherId: string
    ): Promise<Lesson>;
}