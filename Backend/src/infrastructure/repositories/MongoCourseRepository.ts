
import { Types } from "mongoose";

import { ICourseRepository } from "../../domain/repositories/courseRepositories/ICourseRepository";
import { CourseSearchCriteria } from "../../domain/repositories/courseRepositories/CourseSearchCriteria";
import { Course } from "../../domain/entities/Course";

import { BaseRepository } from "./BaseRepository";
import {
    CourseDocument,
    CourseModel,
} from "../database/models/CourseModel";

import { CoursePersistenceMapper } from "../mappers/CoursePersistanceMapper";
import { CourseStatus } from "../../shared/enums/CourseStatus";

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
            teacherId: new Types.ObjectId(teacherId),
        });

        return documents.map(
            CoursePersistenceMapper.toDomain
        );
    }

    async findPublished(
        criteria: CourseSearchCriteria
    ): Promise<Course[]> {
        const conditions: {
            status: CourseStatus;
            $or?: Array<Record<string, unknown>>;
            categoryId?: Types.ObjectId;
            level?: string;
            finalPrice?: {
                $gte?: number;
                $lte?: number;
            };
        } = {
            status: CourseStatus.PUBLISHED,
        };

        if (criteria.search?.trim()) {
            const escapedSearch = criteria.search
                .trim()
                .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            const searchRegex = {
                $regex: escapedSearch,
                $options: "i",
            };

            conditions.$or = [
                { title: searchRegex },
                { subtitle: searchRegex },
                { description: searchRegex },
            ];
        }

        if (criteria.categoryId) {
            conditions.categoryId = new Types.ObjectId(
                criteria.categoryId
            );
        }

        if (criteria.level) {
            conditions.level = criteria.level;
        }

        if (
            criteria.minPrice !== undefined ||
            criteria.maxPrice !== undefined
        ) {
            conditions.finalPrice = {};

            if (criteria.minPrice !== undefined) {
                conditions.finalPrice.$gte = criteria.minPrice;
            }

            if (criteria.maxPrice !== undefined) {
                conditions.finalPrice.$lte = criteria.maxPrice;
            }
        }

        const documents = await this.model
            .find(conditions)
            .sort({ createdAt: -1 })
            .exec();

        return documents.map(
            CoursePersistenceMapper.toDomain
        );
    }

    async findPublishedById(
        courseId: string
    ): Promise<Course | null> {
        const document = await this.model
            .findOne({
                _id: courseId,
                status: CourseStatus.PUBLISHED,
            })
            .exec();

        if (!document) {
            return null;
        }

        return CoursePersistenceMapper.toDomain(document);
    }

    async update(
        courseId: string,
        course: Partial<Course>
    ): Promise<Course | null> {
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

    async incrementTotalStudents(
        courseId: string
    ): Promise<boolean> {
        const updatedCourse = await this.model
            .findByIdAndUpdate(
                courseId,
                { $inc: { totalStudents: 1 } },
                { new: true, runValidators: true }
            )
            .exec();

        return updatedCourse !== null;
    }


    async findPending(): Promise<Course[]> {
        const documents = await this.model
            .find({ status: CourseStatus.PENDING })
            .sort({ createdAt: 1 })
            .exec();

        return documents.map(
            CoursePersistenceMapper.toDomain
        );
    }

}
