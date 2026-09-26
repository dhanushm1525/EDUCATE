import { Types } from "mongoose";

import { ILessonRepository } from "../../domain/repositories/courseRepositories/ILessonRepository";
import { Lesson } from "../../domain/entities/Lesson";

import { BaseRepository } from "./BaseRepository";

import {
    LessonDocument,
    LessonModel,
} from "../database/models/LessonModel";

import { LessonPersistenceMapper } from "../mappers/LessonPersistenceMapper";

export class MongoLessonRepository
    extends BaseRepository<LessonDocument>
    implements ILessonRepository {

    constructor() {
        super(LessonModel);
    }

    async create(lesson: Lesson): Promise<Lesson> {

        const documentData =
            LessonPersistenceMapper.toPersistence(lesson);

        const document =
            await this.createDocument(documentData);

        return LessonPersistenceMapper.toDomain(document);
    }

    async findById(
        lessonId: string
    ): Promise<Lesson | null> {

        const document =
            await this.findByIdDocument(lessonId);

        if (!document) {
            return null;
        }

        return LessonPersistenceMapper.toDomain(document);
    }

    async findByChapterId(
        chapterId: string
    ): Promise<Lesson[]> {

        const documents =
            await this.findManyDocuments({
                chapterId: new Types.ObjectId(chapterId),
            });

        return documents
            .sort((a, b) => a.order - b.order)
            .map(LessonPersistenceMapper.toDomain);
    }

    async update(
        lessonId: string,
        lesson: Partial<Lesson>
    ): Promise<Lesson | null> {

        const updateData =
            LessonPersistenceMapper.toPersistenceUpdate(lesson);

        const document =
            await this.updateByIdDocument(
                lessonId,
                updateData
            );

        if (!document) {
            return null;
        }

        return LessonPersistenceMapper.toDomain(document);
    }

    async delete(
        lessonId: string
    ): Promise<boolean> {

        return await this.deleteByIdDocument(lessonId);
    }
}