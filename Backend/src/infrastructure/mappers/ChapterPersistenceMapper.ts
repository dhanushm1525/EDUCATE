import { Chapter } from "../../domain/entities/Chapter";
import { ChapterDocument } from "../database/models/ChapterModel";

export class ChapterPersistenceMapper {

    static toDomain(
        document: ChapterDocument
    ): Chapter {
        return {
            chapterId: document._id.toString(),

            courseId: document.courseId.toString(),

            title: document.title,
            description: document.description,

            order: document.order,
            outcomes: document.outcomes,

            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        };
    }

    static toPersistence(chapter: Chapter) {
        return {
            courseId: chapter.courseId,

            title: chapter.title,
            description: chapter.description,

            order: chapter.order,
            outcomes: chapter.outcomes ?? [],
        };
    }

    static toPersistenceUpdate(
        chapter: Partial<Chapter>
    ) {
        const {
            chapterId: _chapterId,
            createdAt: _createdAt,
            updatedAt: _updatedAt,
            ...updateData
        } = chapter;

        return updateData;
    }
}