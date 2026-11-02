
import { Types } from "mongoose";

import {
    AssignmentSubmission,
} from "../../domain/entities/AssignmentSubmission";

import {
    IAssignmentSubmissionRepository,
} from "../../domain/repositories/courseRepositories/IAssignmentSubmissionRepository";

import { BaseRepository } from "./BaseRepository";

import {
    AssignmentSubmissionDocument,
    AssignmentSubmissionModel,
} from "../database/models/AssignmentSubmissionModel";

import {
    AssignmentSubmissionPersistenceMapper,
} from "../mappers/AssignmentSubmissionPersistenceMapper";


export class MongoAssignmentSubmissionRepository
    extends BaseRepository<AssignmentSubmissionDocument>
    implements IAssignmentSubmissionRepository {

    constructor() {
        super(AssignmentSubmissionModel);
    }

    async create(
        submission: AssignmentSubmission
    ): Promise<AssignmentSubmission> {

        const documentData =
            AssignmentSubmissionPersistenceMapper.toPersistence(
                submission
            );

        const document =
            await this.createDocument(documentData);

        return AssignmentSubmissionPersistenceMapper.toDomain(
            document
        );
    }

    async findById(
        submissionId: string
    ): Promise<AssignmentSubmission | null> {

        const document =
            await this.findByIdDocument(submissionId);

        if (!document) {
            return null;
        }

        return AssignmentSubmissionPersistenceMapper.toDomain(
            document
        );
    }

    async findByAssignmentAndUser(
        assignmentId: string,
        userId: string
    ): Promise<AssignmentSubmission[]> {

        const documents = await this.findManyDocuments({
            assignmentId: new Types.ObjectId(assignmentId),
            userId: new Types.ObjectId(userId),
        });

        return documents.map(
            AssignmentSubmissionPersistenceMapper.toDomain
        );
    }

    async findByUserId(
        userId: string
    ): Promise<AssignmentSubmission[]> {

        const documents = await this.findManyDocuments({
            userId: new Types.ObjectId(userId),
        });

        return documents.map(
            AssignmentSubmissionPersistenceMapper.toDomain
        );
    }

    async findByAssignmentId(
        assignmentId: string
    ): Promise<AssignmentSubmission[]> {

        const documents = await this.findManyDocuments({
            assignmentId: new Types.ObjectId(assignmentId),
        });

        return documents.map(
            AssignmentSubmissionPersistenceMapper.toDomain
        );
    }

    async update(
        submissionId: string,
        submission: AssignmentSubmission
    ): Promise<AssignmentSubmission | null> {

        const documentData =
            AssignmentSubmissionPersistenceMapper.toPersistence(
                submission
            );

        const document =
            await this.updateByIdDocument(
                submissionId,
                documentData
            );

        if (!document) {
            return null;
        }

        return AssignmentSubmissionPersistenceMapper.toDomain(
            document
        );
    }
}
