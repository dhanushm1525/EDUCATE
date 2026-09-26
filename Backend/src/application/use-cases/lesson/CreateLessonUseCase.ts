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
        private readonly lessonRepository: ILessonRepository,
        private readonly chapterRepository: IChapterRepository,
        private readonly courseRepository: ICourseRepository,
        private readonly courseStatusPolicy: ICourseStatusPolicy
    ) { }

    async execute(
        courseId: string,
        chapterId: string,
        teacherId: string,
        dto: CreateLessonDTO
    ): Promise<Lesson> {

        const chapter =
            await this.chapterRepository.findById(chapterId);



        if (!chapter) {
            throw new AppError("Chapter not found", 404);
        }

        if (chapter.courseId !== courseId) {
            throw new AppError(
                "Chapter does not belong to this course",
                400
            );
        }

        const course =
            await this.courseRepository.findById(courseId);

        if (!course) {
            throw new AppError("Course not found", 404);
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

        const lesson =
            LessonCreationMapper.toEntity(
                chapterId,
                dto
            );

        return await this.lessonRepository.create(lesson);
    }
}