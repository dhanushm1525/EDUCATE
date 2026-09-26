import { Lesson } from "../../../domain/entities/Lesson";
import { UpdateLessonDTO } from "../../dtos/lesson/UpdateLessonDTO";

export interface IUpdateLessonUseCase {
    execute(
        courseId: string,
        chapterId: string,
        lessonId: string,
        teacherId: string,
        dto: UpdateLessonDTO
    ): Promise<Lesson>;
}