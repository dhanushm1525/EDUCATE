import { Chapter } from "../../domain/entities/Chapter";
import { Lesson } from "../../domain/entities/Lesson";
import {
    ChapterPreviewDTO,
    CourseLearningContentDTO,
    LessonPreviewDTO,
} from "../dtos/courses/CourseLearningContentDTO";

export class CourseLearningContentMapper {
    static toLessonPreviewDTO(
        lesson: Lesson,
        thumbnailUrl?: string
    ): LessonPreviewDTO {
        return {
            lessonId: lesson.lessonId,
            title: lesson.title,
            description: lesson.description,
            order: lesson.order,
            type: lesson.type,
            duration: lesson.duration,
            thumbnailUrl,
        };
    }

    static toChapterPreviewDTO(
        chapter: Chapter,
        lessons: LessonPreviewDTO[]
    ): ChapterPreviewDTO {
        return {
            chapterId: chapter.chapterId,
            title: chapter.title,
            description: chapter.description,
            order: chapter.order,
            outcomes: chapter.outcomes,
            lessons,
        };
    }

    static toDTO(chapters: ChapterPreviewDTO[]): CourseLearningContentDTO {
        return { chapters };
    }
}
