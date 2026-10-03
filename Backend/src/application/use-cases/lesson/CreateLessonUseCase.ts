import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { AppError } from "../../../shared/errors/AppError";

import { Lesson } from "../../../domain/entities/Lesson";

import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";
import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";

import { ICourseStatusPolicy } from "../../../domain/policies/CourseStatusPolicy";

import { CreateLessonDTO } from "../../dtos/lesson/CreateLessonDTO";

import { ICreateLessonUseCase } from "../../interfaces/lesson/ICreateLessonUseCase";

import { LessonCreationMapper } from "../../mappers/LessonCreationMapper";

export class CreateLessonUseCase
    implements ICreateLessonUseCase {

    constructor(
        private readonly _lessonRepository: ILessonRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _courseRepository: ICourseRepository,
        private readonly _courseStatusPolicy: ICourseStatusPolicy
    ) { }

    async execute(
        courseId: string,
        chapterId: string,
        teacherId: string,
        dto: CreateLessonDTO
    ): Promise<Lesson> {

        const chapter =
            await this._chapterRepository.findById(chapterId);



        if (!chapter) {
            throw new AppError("Chapter not found", HttpStatusCode.NOT_FOUND);
        }

        if (chapter.courseId !== courseId) {
            throw new AppError(
                "Chapter does not belong to this course",
                HttpStatusCode.BAD_REQUEST
            );
        }

        const course =
            await this._courseRepository.findById(courseId);

        if (!course) {
            throw new AppError("Course not found", HttpStatusCode.NOT_FOUND);
        }

        if (course.teacherId !== teacherId) {
            throw new AppError(
                "You are not authorized to modify this course",
                HttpStatusCode.FORBIDDEN
            );
        }

        if (!this._courseStatusPolicy.canEdit(course.status)) {
            throw new AppError(
                "This course cannot be modified",
                HttpStatusCode.BAD_REQUEST
            );
        }

        const lesson =
            LessonCreationMapper.toEntity(
                chapterId,
                dto
            );

        return await this._lessonRepository.create(lesson);
    }
}