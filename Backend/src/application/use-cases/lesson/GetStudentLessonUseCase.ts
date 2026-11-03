
import { EnrollmentStatus } from "../../../domain/entities/Enrollment";

import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";
import { IEnrollmentRepository } from "../../../domain/repositories/courseRepositories/IEnrollmentRepository";

import { IStorageService } from "../../interfaces/storage/IStorageService";
import { IGetStudentLessonUseCase } from "../../interfaces/lesson/IGetStudentLessonUseCase";

import { StudentLessonDTO } from "../../dtos/lesson/StudentLessonDTO";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class GetStudentLessonUseCase
    implements IGetStudentLessonUseCase {

    constructor(
        private readonly _lessonRepository: ILessonRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _courseRepository: ICourseRepository,
        private readonly _enrollmentRepository: IEnrollmentRepository,
        private readonly _storageService: IStorageService
    ) { }

    async execute(
        courseId: string,
        chapterId: string,
        lessonId: string,
        userId: string
    ): Promise<StudentLessonDTO> {

        // 1. Validate MongoDB IDs.
        const ids = [courseId, chapterId, lessonId, userId];

        if (ids.some(id => !/^[0-9a-fA-F]{24}$/.test(id))) {
            throw new AppError(
                "Invalid course, chapter, lesson or user ID",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 2. Verify active enrollment.
        const enrollment =
            await this._enrollmentRepository.findByUserAndCourse(
                userId,
                courseId
            );

        if (!enrollment || enrollment.status !== EnrollmentStatus.ACTIVE) {
            throw new AppError(
                "You must be actively enrolled to access this lesson",
                HttpStatusCode.FORBIDDEN
            );
        }

        // 3. Verify that the course is published.
        const course =
            await this._courseRepository.findPublishedById(courseId);

        if (!course) {
            throw new AppError(
                "Published course not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 4. Verify that the chapter belongs to the course.
        const chapter =
            await this._chapterRepository.findById(chapterId);

        if (!chapter) {
            throw new AppError(
                "Chapter not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        if (chapter.courseId !== courseId) {
            throw new AppError(
                "Chapter does not belong to this course",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 5. Retrieve the lesson.
        const lesson =
            await this._lessonRepository.findById(lessonId);

        if (!lesson) {
            throw new AppError(
                "Lesson not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        if (lesson.chapterId !== chapterId) {
            throw new AppError(
                "Lesson does not belong to this chapter",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 6. Generate signed URLs for private S3 files.
        const videoUrl = lesson.videoKey
            ? await this._storageService.generateDownloadUrl(
                lesson.videoKey
            )
            : undefined;

        const thumbnailUrl = lesson.thumbnailKey
            ? await this._storageService.generateDownloadUrl(
                lesson.thumbnailKey
            )
            : undefined;

        const attachments = await Promise.all(
            (lesson.attachments ?? []).map(key =>
                this._storageService.generateDownloadUrl(key)
            )
        );

        // 7. Return student-safe lesson data.
        return {
            lessonId: lesson.lessonId!,
            chapterId: lesson.chapterId,
            title: lesson.title,
            description: lesson.description,
            order: lesson.order,
            type: lesson.type,
            duration: lesson.duration,
            videoUrl,
            thumbnailUrl,
            attachments,
            content: lesson.content
        };
    }
}
