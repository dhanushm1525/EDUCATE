
import { Types } from "mongoose";

import {
    AssignmentSubmission,
    SubmissionStatus,
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

    async findActiveAttempt(
        assignmentId: string,
        userId: string
    ): Promise<AssignmentSubmission | null> {

        const documents = await this.findManyDocuments({
            assignmentId: new Types.ObjectId(assignmentId),
            userId: new Types.ObjectId(userId),
            status: SubmissionStatus.IN_PROGRESS,
        });

        if (documents.length === 0) {
            return null;
        }

        return AssignmentSubmissionPersistenceMapper.toDomain(
            documents[0]
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



    async updateAnswers(
        assignmentId: string,
        userId: string,
        answers: AssignmentSubmission["answers"]
    ): Promise<AssignmentSubmission | null> {

        const now = new Date();

        const document =
            await AssignmentSubmissionModel.findOneAndUpdate(
                {
                    assignmentId: new Types.ObjectId(assignmentId),
                    userId: new Types.ObjectId(userId),
                    status: SubmissionStatus.IN_PROGRESS,

                    $or: [
                        { expiresAt: { $gt: now } },
                        { expiresAt: { $exists: false } },
                    ],
                },
                {
                    $set: {
                        answers: answers.map(answer => ({
                            questionId: answer.questionId,
                            selectedAnswer: answer.selectedAnswer,
                        })),
                    },
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!document) {
            return null;
        }

        return AssignmentSubmissionPersistenceMapper.toDomain(
            document
        );
    }

}
