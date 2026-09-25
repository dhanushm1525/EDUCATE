import { Chapter } from "../../../domain/entities/Chapter";
import { CreateChapterDTO } from "../../dtos/chapter/CreateChapterDTO";

export interface ICreateChapterUseCase {
    execute(
        courseId: string,
        teacherId: string,
        dto: CreateChapterDTO
    ): Promise<Chapter>;
}