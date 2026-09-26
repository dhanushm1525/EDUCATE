import { Lesson } from "../../domain/entities/Lesson";
import { LessonDocument } from "../database/models/LessonModel";

export class LessonPersistenceMapper {

    static toDomain(document: LessonDocument): Lesson {
        return {
            lessonId: document._id.toString(),
            chapterId: document.chapterId.toString(),
            title: document.title,
            description: document.description,
            order: document.order,
            type: document.type,
            videoUrl: document.videoUrl,
            content: document.content,
            attachments: document.attachments,
            duration: document.duration,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        };
    }

    static toPersistence(lesson: Lesson) {
        return {
            chapterId: lesson.chapterId,
            title: lesson.title,
            description: lesson.description,
            order: lesson.order,
            type: lesson.type,
            videoUrl: lesson.videoUrl,
            content: lesson.content,
            attachments: lesson.attachments ?? [],
            duration: lesson.duration,
        };
    }

    static toPersistenceUpdate(lesson: Partial<Lesson>) {

        const {
            lessonId: _lessonId,
            createdAt: _createdAt,
            updatedAt: _updatedAt,
            ...updateData
        } = lesson;

        return updateData;
    }
}