import { Lesson } from "../../../domain/entities/Lesson";
import { CreateLessonDTO } from "../../dtos/lesson/CreateLessonDTO";

export interface ICreateLessonUseCase {
    execute(
        courseId: string,
        chapterId: string,
        teacherId: string,
        dto: CreateLessonDTO
    ): Promise<Lesson>;
}