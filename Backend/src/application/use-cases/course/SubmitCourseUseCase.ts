import { IAssignmentRepository } from "../../../domain/repositories/courseRepositories/IAssingmentRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";
import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";

import { ICourseStatusPolicy } from "../../../domain/policies/CourseStatusPolicy";
import { AssignmentPolicy } from "../../../domain/policies/AssignmentPolicy";

import { SubmitCourseDTO } from "../../dtos/courses/SubmitCourseDTO";
import { ISubmitCourseUseCase } from "../../interfaces/course/ISubmitCourseUseCase";

import { Course } from "../../../domain/entities/Course";
import { LessonType } from "../../../shared/enums/LessonType";

import { CourseStatus } from "../../../shared/enums/CourseStatus";
import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class SubmitCourseUseCase
    implements ISubmitCourseUseCase {

    constructor(
        private readonly _courseRepository: ICourseRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _lessonRepository: ILessonRepository,
        private readonly _assignmentRepository: IAssignmentRepository,
        private readonly _courseStatusPolicy: ICourseStatusPolicy
    ) {}

    async execute(
        dto: SubmitCourseDTO
    ): Promise<Course> {

        // 1. Find course
        const course =
            await this._courseRepository.findById(
                dto.courseId
            );

        if (!course) {
            throw new AppError(
                "Course not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 2. Verify teacher ownership
        if (course.teacherId !== dto.teacherId) {
            throw new AppError(
                "You are not authorized to submit this course",
                HttpStatusCode.FORBIDDEN
            );
        }

        // 3. Verify course status
        if (
            !this._courseStatusPolicy.canSubmit(
                course.status
            )
        ) {
            throw new AppError(
                "Course cannot be submitted in its current status",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 4. Find chapters
        const chapters =
            await this._chapterRepository.findByCourseId(
                dto.courseId
            );

        if (chapters.length === 0) {
            throw new AppError(
                "Course must contain at least one chapter",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 5. Validate every chapter
        for (const chapter of chapters) {

            const lessons =
                await this._lessonRepository.findByChapterId(
                    chapter.chapterId!
                );

            if (lessons.length === 0) {
                throw new AppError(
                    "Each chapter must contain at least one lesson",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            // 6. Validate every lesson
            for (const lesson of lessons) {

                if (!lesson.title.trim()) {
                    throw new AppError(
                        "Lesson title is required",
                        HttpStatusCode.BAD_REQUEST
                    );
                }

                if (
                    lesson.type === LessonType.VIDEO &&
                    !lesson.videoKey
                ) {
                    throw new AppError(
                        "Video lesson must contain a video",
                        HttpStatusCode.BAD_REQUEST
                    );
                }

                if (
                    lesson.type === LessonType.READING &&
                    !lesson.content?.trim()
                ) {
                    throw new AppError(
                        "Reading lesson must contain content",
                        HttpStatusCode.BAD_REQUEST
                    );
                }

                // Assignment is optional
                const assignment =
                    await this._assignmentRepository.findByLessonId(
                        lesson.lessonId!
                    );

                if (!assignment) {
                    continue;
                }

                // Validate assignment
                AssignmentPolicy.validate(
                    assignment.title,
                    assignment.questions,
                    assignment.passingMarks,
                    assignment.timeLimit,
                    assignment.attemptsAllowed
                );
            }
        }

        // 7. Submit course
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