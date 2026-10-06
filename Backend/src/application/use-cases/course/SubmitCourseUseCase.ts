import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";

import { ISubmitCourseUseCase } from "../../interfaces/course/ISubmitCourseUseCase";

import { SubmitCourseDTO } from "../../dtos/courses/SubmitCourseDTO";

import { ICourseStatusPolicy } from "../../../domain/policies/CourseStatusPolicy";

import { LessonType } from "../../../shared/enums/LessonType";
import { CourseStatus } from "../../../shared/enums/CourseStatus";
import { COURSE_MESSAGES } from "../../../shared/messages/courseMessages";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class SubmitCourseUseCase implements ISubmitCourseUseCase {

    constructor(
        private readonly _courseRepository: ICourseRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _lessonRepository: ILessonRepository,
        private readonly _courseStatusPolicy: ICourseStatusPolicy
    ) { }

    async execute(dto: SubmitCourseDTO) {


        const course =
            await this._courseRepository.findById(dto.courseId);

        if (!course) {
            throw new AppError(
                COURSE_MESSAGES.COURSE_NOT_FOUND,
                HttpStatusCode.NOT_FOUND
            );
        }

        if (course.teacherId !== dto.teacherId) {
            throw new AppError(
                COURSE_MESSAGES.COURSE_NOT_AUTHORIZED,
                HttpStatusCode.FORBIDDEN
            );
        }


        if (!this._courseStatusPolicy.canSubmit(course.status)) {
            throw new AppError(
                COURSE_MESSAGES.COURSE_CANNOT_BE_SUBMITTED,
                HttpStatusCode.BAD_REQUEST
            );
        }


        const chapters =
            await this._chapterRepository.findByCourseId(
                dto.courseId
            );

        if (chapters.length === 0) {
            throw new AppError(
                COURSE_MESSAGES.COURSE_MUST_HAVE_CHAPTER,
                HttpStatusCode.BAD_REQUEST
            );
        }


        for (const chapter of chapters) {

            if (!chapter.chapterId) {
                throw new AppError(
                    "Invalid chapter",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            const lessons =
                await this._lessonRepository.findByChapterId(
                    chapter.chapterId
                );


            if (lessons.length === 0) {
                throw new AppError(
                    `${COURSE_MESSAGES.CHAPTER_MUST_HAVE_LESSON}: "${chapter.title}"`,
                    HttpStatusCode.BAD_REQUEST
                );
            }


            for (const lesson of lessons) {

                if (!lesson.title.trim()) {
                    throw new AppError(
                        `Lesson title is required in chapter "${chapter.title}"`,
                        HttpStatusCode.BAD_REQUEST
                    );
                }

                if (lesson.type === LessonType.VIDEO) {

                    if (!lesson.videoKey) {
                        throw new AppError(
                            `Video lesson "${lesson.title}" must contain a video`,
                            HttpStatusCode.BAD_REQUEST
                        );
                    }
                }

                if (lesson.type === LessonType.READING) {

                    if (!lesson.content?.trim()) {
                        throw new AppError(
                            `Reading lesson "${lesson.title}" must contain content`,
                            HttpStatusCode.BAD_REQUEST
                        );
                    }
                }
            }
        }


        const updatedCourse =
            await this._courseRepository.update(
                dto.courseId,
                {
                    status: CourseStatus.PENDING,
                    rejectionReason: undefined,
                }
            );

        if (!updatedCourse) {
            throw new AppError(
                "Failed to submit course",
                HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }

        return updatedCourse;
    }
}