import { Chapter } from "../../domain/entities/Chapter";
import { CreateChapterDTO } from "../dtos/chapter/CreateChapterDTO";
import { UpdateChapterDTO } from "../dtos/chapter/UpdateChapterDTO";

export class ChapterCreationMapper {

    static toCreateChapterDTO(
        body: CreateChapterDTO
    ): CreateChapterDTO {

        return {
            title: body.title,
            description: body.description,
            order: body.order,
            outcomes: body.outcomes,
        };
    }

    static toUpdateChapterDTO(
        body: UpdateChapterDTO
    ): UpdateChapterDTO {

        return {
            title: body.title,
            description: body.description,
            order: body.order,
            outcomes: body.outcomes,
        };
    }

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