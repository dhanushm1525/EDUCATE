import { Lesson } from "../../domain/entities/Lesson";
import { CreateLessonDTO } from "../dtos/lesson/CreateLessonDTO";

export class LessonCreationMapper {

    static toEntity(
        chapterId: string,
        dto: CreateLessonDTO
    ): Lesson {

        return {
            chapterId,
            title: dto.title,
            description: dto.description,
            order: dto.order,
            type: dto.type,
            videoUrl: dto.videoUrl,
            content: dto.content,
            attachments: dto.attachments,
            duration: dto.duration,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
}