import { Chapter } from "../../../domain/entities/Chapter";

import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { CourseStatusPolicy } from "../../../domain/policies/CourseStatusPolicy";

import { CreateChapterDTO } from "../../dtos/chapter/CreateChapterDTO";
import { ICreateChapterUseCase } from "../../interfaces/chapter/ICreateChapterUseCase";

import { ChapterCreationMapper } from "../../mappers/ChapterCreationMapper";

import { AppError } from "../../../shared/errors/AppError";

export class CreateChapterUseCase
    implements ICreateChapterUseCase {

    constructor(
        private readonly chapterRepository: IChapterRepository,
        private readonly courseRepository: ICourseRepository,
        private readonly courseStatusPolicy: CourseStatusPolicy
    ) {}

    async execute(
        courseId: string,
        teacherId: string,
        dto: CreateChapterDTO
    ): Promise<Chapter> {

        const course =
            await this.courseRepository.findById(courseId);

        if (!course) {
            throw new AppError(
                "Course not found",
                404
            );
        }

        if (course.teacherId !== teacherId) {
            throw new AppError(
                "You are not authorized to modify this course",
                403
            );
        }

        if (!this.courseStatusPolicy.canEdit(course.status)) {
            throw new AppError(
                "This course cannot be modified",
                400
            );
        }

        const chapter =
            ChapterCreationMapper.toEntity(
                courseId,
                dto
            );

        return await this.chapterRepository.create(
            chapter
        );
    }
}