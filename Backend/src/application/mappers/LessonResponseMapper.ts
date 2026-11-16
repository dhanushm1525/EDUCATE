import { Lesson } from "../../domain/entities/Lesson";
import { LessonResponseDTO } from "../dtos/lesson/LessonResponseDTO";

export class LessonResponseMapper {
    static toDTO(lesson: Lesson): LessonResponseDTO {
        if (!lesson.lessonId) {
            throw new Error("Cannot map a lesson without a lesson ID");
        }

        return {
            lessonId: lesson.lessonId,
            chapterId: lesson.chapterId,
            title: lesson.title,
            description: lesson.description,
            order: lesson.order,
            type: lesson.type,
            videoKey: lesson.videoKey,
            thumbnailKey: lesson.thumbnailKey,
            content: lesson.content,
            attachments: lesson.attachments,
            duration: lesson.duration,
            createdAt: lesson.createdAt.toISOString(),
            updatedAt: lesson.updatedAt.toISOString(),
        };
    }

    static toDTOList(lessons: Lesson[]): LessonResponseDTO[] {
        return lessons.map(lesson => this.toDTO(lesson));
    }
}
