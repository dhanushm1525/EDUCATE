import { Chapter } from "../../../domain/entities/Chapter";

export interface IGetChapterByIdUseCase {
    execute(
        chapterId: string,
        teacherId: string
    ): Promise<Chapter>;
}