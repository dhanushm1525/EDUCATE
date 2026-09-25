import { Chapter } from "../../../domain/entities/Chapter";

export interface IGetChaptersByCourseUseCase {
    execute(courseId: string,teacherId: string): Promise<Chapter[]>;
}