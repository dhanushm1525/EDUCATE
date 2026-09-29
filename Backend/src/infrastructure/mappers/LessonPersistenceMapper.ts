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
            videoKey: document.videoUrl,
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
            videoUrl: lesson.videoKey,
            content: lesson.content,
            attachments: lesson.attachments ?? [],
            duration: lesson.duration,
        };
    }

static toPersistenceUpdate(lesson: Partial<Lesson>) {

    const updateData: Record<string, unknown> = {};

    if (lesson.chapterId !== undefined) {
        updateData.chapterId = lesson.chapterId;
    }

    if (lesson.title !== undefined) {
        updateData.title = lesson.title;
    }

    if (lesson.description !== undefined) {
        updateData.description = lesson.description;
    }

    if (lesson.order !== undefined) {
        updateData.order = lesson.order;
    }

    if (lesson.type !== undefined) {
        updateData.type = lesson.type;
    }

    if (lesson.videoKey !== undefined) {
        updateData.videoUrl = lesson.videoKey;
    }

    if (lesson.content !== undefined) {
        updateData.content = lesson.content;
    }

    if (lesson.attachments !== undefined) {
        updateData.attachments = lesson.attachments;
    }

    if (lesson.duration !== undefined) {
        updateData.duration = lesson.duration;
    }

    return updateData;
}
}