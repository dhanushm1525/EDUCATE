import { Types } from "mongoose";

import { CourseProgress } from "../../domain/entities/CourseProgress";
import { ICourseProgressRepository } from "../../domain/repositories/courseRepositories/ICourseProgressRepository";

import { BaseRepository } from "./BaseRepository";

import {
  CourseProgressDocument,
  CourseProgressModel,
} from "../database/models/CourseProgressModel";

import { CourseProgressPersistenceMapper } from "../mappers/CourseProgressPersistenceMapper";

export class MongoCourseProgressRepository
  extends BaseRepository<CourseProgressDocument>
  implements ICourseProgressRepository
{
  constructor() {
    super(CourseProgressModel);
  }

  async create(progress: CourseProgress): Promise<CourseProgress> {
    const documentData = CourseProgressPersistenceMapper.toPersistence(progress);

    const document = await this.createDocument(documentData);

    return CourseProgressPersistenceMapper.toDomain(document);
  }

  async findById(progressId: string): Promise<CourseProgress | null> {
    const document = await this.findByIdDocument(progressId);

    if (!document) {
      return null;
    }

    return CourseProgressPersistenceMapper.toDomain(document);
  }

  async findByEnrollmentId(enrollmentId: string): Promise<CourseProgress | null> {
    const document = await this.findOneDocument({
      enrollmentId: new Types.ObjectId(enrollmentId),
    });

    if (!document) {
      return null;
    }

    return CourseProgressPersistenceMapper.toDomain(document);
  }

  async findByUserAndCourse(userId: string, courseId: string): Promise<CourseProgress | null> {
    const document = await this.findOneDocument({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
    });

    if (!document) {
      return null;
    }

    return CourseProgressPersistenceMapper.toDomain(document);
  }

  async findByUserId(userId: string): Promise<CourseProgress[]> {
    const documents = await this.findManyDocuments({
      userId: new Types.ObjectId(userId),
    });

    return documents.map(CourseProgressPersistenceMapper.toDomain);
  }

  async update(
    progressId: string,
    progress: Partial<CourseProgress>,
  ): Promise<CourseProgress | null> {
    const updateData = CourseProgressPersistenceMapper.toPersistenceUpdate(progress);

    const document = await this.updateByIdDocument(progressId, updateData);

    if (!document) {
      return null;
    }

    return CourseProgressPersistenceMapper.toDomain(document);
  }
}
