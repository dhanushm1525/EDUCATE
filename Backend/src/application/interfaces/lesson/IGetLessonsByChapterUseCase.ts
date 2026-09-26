import { Lesson } from "../../../domain/entities/Lesson";

export interface IGetLessonsByChapterUseCase {
    execute(
        courseId: string,
        chapterId: string,
        teacherId: string
    ): Promise<Lesson[]>;
}