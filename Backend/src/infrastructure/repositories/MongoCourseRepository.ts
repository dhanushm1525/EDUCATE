import { ICourseRepository } from "../../domain/repositories/courseRepositories/ICourseRepository";
import { Course } from "../../domain/entities/Course";

import { BaseRepository } from "./BaseRepository";
import { CourseDocument, CourseModel } from "../database/models/CourseModel";

import { CoursePersistenceMapper } from "../mappers/CoursePersistanceMapper";

import { Types } from "mongoose";

export class MongoCourseRepository
    extends BaseRepository<CourseDocument>
    implements ICourseRepository {

    constructor() {
        super(CourseModel);
    }

    async create(course: Course): Promise<Course> {

        const documentData =
            CoursePersistenceMapper.toPersistence(course);

        const document =
            await this.createDocument(documentData);

        return CoursePersistenceMapper.toDomain(document);
    }

    async findById(courseId: string): Promise<Course | null> {

        const document =
            await this.findByIdDocument(courseId);

        if (!document) {
            return null;
        }

        return CoursePersistenceMapper.toDomain(document);
    }

    async findByTeacherId(teacherId: string): Promise<Course[]> {

        const documents = await this.findManyDocuments({
            teacherId: new Types.ObjectId(teacherId)
        });

        return documents.map(
            CoursePersistenceMapper.toDomain
        );
    }

    async update(courseId: string, course: Partial<Course>): Promise<Course | null> {

        const updateData =
            CoursePersistenceMapper.toPersistenceUpdate(course);

        const document =
            await this.updateByIdDocument(
                courseId,
                updateData
            );

        if (!document) {
            return null;
        }

        return CoursePersistenceMapper.toDomain(document);
    }

    async delete(courseId: string): Promise<boolean> {

        return await this.deleteByIdDocument(courseId);
    }
}