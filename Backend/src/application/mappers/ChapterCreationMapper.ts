import { Chapter } from "../../domain/entities/Chapter";
import { CreateChapterDTO } from "../dtos/chapter/CreateChapterDTO";

export class ChapterCreationMapper {

    static toEntity(
        courseId: string,
        dto: CreateChapterDTO
    ): Chapter {

        return {
            courseId,

            title: dto.title,
            description: dto.description,

            order: dto.order,
            outcomes: dto.outcomes,

            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
}