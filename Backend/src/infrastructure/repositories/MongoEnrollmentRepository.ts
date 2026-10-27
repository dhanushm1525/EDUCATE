
import { Types } from "mongoose";

import { Enrollment } from "../../domain/entities/Enrollment";
import { IEnrollmentRepository } from "../../domain/repositories/courseRepositories/IEnrollmentRepository";

import { BaseRepository } from "./BaseRepository";
import {
    EnrollmentDocument,
    EnrollmentModel,
} from "../database/models/EnrollmentModel";

import { EnrollmentPersistenceMapper } from "../mappers/EnrollmentPersistenceMapper";

export class MongoEnrollmentRepository
    extends BaseRepository<EnrollmentDocument>
    implements IEnrollmentRepository {

    constructor() {
        super(EnrollmentModel);
    }

    async create(enrollment: Enrollment): Promise<Enrollment> {
        const documentData =
            EnrollmentPersistenceMapper.toPersistence(enrollment);

        const document = await this.createDocument(documentData);

        return EnrollmentPersistenceMapper.toDomain(document);
    }

    async findById(enrollmentId: string): Promise<Enrollment | null> {
        const document = await this.findByIdDocument(enrollmentId);

        if (!document) {
            return null;
        }

        return EnrollmentPersistenceMapper.toDomain(document);
    }

    async findByUserAndCourse(
        userId: string,
        courseId: string
    ): Promise<Enrollment | null> {
        const document = await this.findOneDocument({
            userId: new Types.ObjectId(userId),
            courseId: new Types.ObjectId(courseId),
        });

        if (!document) {
            return null;
        }

        return EnrollmentPersistenceMapper.toDomain(document);
    }

    async findByUserId(userId: string): Promise<Enrollment[]> {
        const documents = await this.findManyDocuments({
            userId: new Types.ObjectId(userId),
        });

        return documents.map(EnrollmentPersistenceMapper.toDomain);
    }

    async findByCourseId(courseId: string): Promise<Enrollment[]> {
        const documents = await this.findManyDocuments({
            courseId: new Types.ObjectId(courseId),
        });

        return documents.map(EnrollmentPersistenceMapper.toDomain);
    }

    async update(
        enrollmentId: string,
        enrollment: Partial<Enrollment>
    ): Promise<Enrollment | null> {
        const updateData =
            EnrollmentPersistenceMapper.toPersistenceUpdate(enrollment);

        const document = await this.updateByIdDocument(
            enrollmentId,
            updateData
        );

        if (!document) {
            return null;
        }

        return EnrollmentPersistenceMapper.toDomain(document);
    }

    async delete(enrollmentId: string): Promise<boolean> {
        return this.deleteByIdDocument(enrollmentId);
    }
}
