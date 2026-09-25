import { Types } from "mongoose";

import { IChapterRepository } from "../../domain/repositories/courseRepositories/IChapterRepository";
import { Chapter } from "../../domain/entities/Chapter";

import { BaseRepository } from "./BaseRepository";

import {
    ChapterDocument,
    ChapterModel,
} from "../database/models/ChapterModel";

import { ChapterPersistenceMapper } from "../mappers/ChapterPersistenceMapper";

export class MongoChapterRepository
    extends BaseRepository<ChapterDocument>
    implements IChapterRepository {

    constructor() {
        super(ChapterModel);
    }

    async create(chapter: Chapter): Promise<Chapter> {
        const documentData =
            ChapterPersistenceMapper.toPersistence(chapter);

        const document =
            await this.createDocument(documentData);

        return ChapterPersistenceMapper.toDomain(document);
    }

    async findById(
        chapterId: string
    ): Promise<Chapter | null> {

        const document =
            await this.findByIdDocument(chapterId);

        if (!document) {
            return null;
        }

        return ChapterPersistenceMapper.toDomain(document);
    }

    async findByCourseId(
        courseId: string
    ): Promise<Chapter[]> {

        const documents =
            await this.findManyDocuments({
                courseId: new Types.ObjectId(courseId),
            });

        return documents
            .sort((a, b) => a.order - b.order)
            .map(ChapterPersistenceMapper.toDomain);
    }

    async update(
        chapterId: string,
        chapter: Partial<Chapter>
    ): Promise<Chapter | null> {

        const updateData =
            ChapterPersistenceMapper.toPersistenceUpdate(
                chapter
            );

        const document =
            await this.updateByIdDocument(
                chapterId,
                updateData
            );

        if (!document) {
            return null;
        }

        return ChapterPersistenceMapper.toDomain(document);
    }

    async delete(
        chapterId: string
    ): Promise<boolean> {

        return await this.deleteByIdDocument(chapterId);
    }
}