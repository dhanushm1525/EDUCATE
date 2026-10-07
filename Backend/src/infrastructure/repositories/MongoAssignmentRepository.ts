import { Types } from "mongoose";

import { IAssignmentRepository } from "../../domain/repositories/courseRepositories/IAssingmentRepository";
import { Assignment } from "../../domain/entities/Assingment";

import { BaseRepository } from "./BaseRepository";

import {
    AssignmentDocument,
    AssignmentModel,
} from "../database/models/AssignmentModel";

import { AssignmentPersistenceMapper } from "../mappers/AssignmentPersistenceMapper";

export class MongoAssignmentRepository
    extends BaseRepository<AssignmentDocument>
    implements IAssignmentRepository {

    constructor() {
        super(AssignmentModel);
    }

    async create(
        assignment: Assignment
    ): Promise<Assignment> {

        const documentData =
            AssignmentPersistenceMapper.toPersistence(
                assignment
            );

        const document =
            await this.createDocument(documentData);

        return AssignmentPersistenceMapper.toDomain(
            document
        );
    }

    async findById(
        assignmentId: string
    ): Promise<Assignment | null> {

        const document =
            await this.findByIdDocument(assignmentId);

        if (!document) {
            return null;
        }

        return AssignmentPersistenceMapper.toDomain(
            document
        );
    }

    async findByLessonId(
        lessonId: string
    ): Promise<Assignment | null> {
        const document = await this.findOneDocument({
            lessonId: new Types.ObjectId(lessonId)
        });

        return document
            ? AssignmentPersistenceMapper.toDomain(document)
            : null;
    }

    async update(
        assignmentId: string,
        assignment: Partial<Assignment>
    ): Promise<Assignment | null> {

        const updateData =
            AssignmentPersistenceMapper.toPersistenceUpdate(
                assignment
            );

        const document =
            await this.updateByIdDocument(
                assignmentId,
                updateData
            );

        if (!document) {
            return null;
        }

        return AssignmentPersistenceMapper.toDomain(
            document
        );
    }

    async delete(
        assignmentId: string
    ): Promise<boolean> {

        return await this.deleteByIdDocument(
            assignmentId
        );
    }
}