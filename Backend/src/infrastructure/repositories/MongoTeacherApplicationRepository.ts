import { ITeacherApplicationRepository } from "../../domain/repositories/userRepositories/ITeacherApplicationRepository";
import { TeacherApplication } from "../../domain/entities/TeacherApplication";

import { BaseRepository } from "./BaseRepository";
import {
    TeacherApplicationDocument,
    TeacherApplicationModel
} from "../database/models/TeacherApplicationModel";

import { TeacherApplicationPersistenceMapper }
    from "../mappers/TeacherApplicationPersistanceMapper";

import { Types } from "mongoose";
import { TeacherApplicationStatus } from "../../shared/enums/TeacherApplicationStatus";


export class MongoTeacherApplicationRepository
    extends BaseRepository<TeacherApplicationDocument>
    implements ITeacherApplicationRepository {

    constructor() {
        super(TeacherApplicationModel);
    }


    async create(
        application: TeacherApplication
    ): Promise<TeacherApplication> {

        const documentData =
            TeacherApplicationPersistenceMapper.toPersistence(
                application
            );

        const document =
            await this.createDocument(documentData);

        return TeacherApplicationPersistenceMapper.toDomain(
            document
        );
    }


    async findById(
        applicationId: string
    ): Promise<TeacherApplication | null> {

        const document =
            await this.findByIdDocument(applicationId);

        if (!document) {
            return null;
        }

        return TeacherApplicationPersistenceMapper.toDomain(
            document
        );
    }


    async findByUserId(
        userId: string
    ): Promise<TeacherApplication[]> {

        const documents =
            await this.findManyDocuments({
                userId: new Types.ObjectId(userId)
            });

        return documents.map(
            TeacherApplicationPersistenceMapper.toDomain
        );
    }


    async findByStatus(
        status: TeacherApplicationStatus
    ): Promise<TeacherApplication[]> {

        const documents =
            await this.findManyDocuments({
                status
            });

        return documents.map(
            TeacherApplicationPersistenceMapper.toDomain
        );
    }


    async update(
        applicationId: string,
        application: Partial<TeacherApplication>
    ): Promise<TeacherApplication | null> {

        const updateData =
            TeacherApplicationPersistenceMapper.toPersistenceUpdate(
                application
            );

        const document =
            await this.updateByIdDocument(
                applicationId,
                updateData
            );

        if (!document) {
            return null;
        }

        return TeacherApplicationPersistenceMapper.toDomain(
            document
        );
    }
}