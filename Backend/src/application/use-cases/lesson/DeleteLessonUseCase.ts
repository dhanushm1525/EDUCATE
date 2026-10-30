import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";

import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";
import { IAssignmentRepository } from "../../../domain/repositories/courseRepositories/IAssingmentRepository";

import { ICourseStatusPolicy } from "../../../domain/policies/CourseStatusPolicy";
import { ILessonMediaKeyPolicy } from "../../../domain/policies/LessonMediaKeyPolicy";

import { IS3Client } from "../../interfaces/storage/IS3Client";
import { IDeleteLessonUseCase } from "../../interfaces/lesson/IDeleteLessonUseCase";

export class DeleteLessonUseCase implements IDeleteLessonUseCase {

    constructor(
        private readonly _lessonRepository: ILessonRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _courseRepository: ICourseRepository,
        private readonly _courseStatusPolicy: ICourseStatusPolicy,
        private readonly _s3Client: IS3Client,
        private readonly _lessonMediaKeyPolicy: ILessonMediaKeyPolicy,
        private readonly _assignmentRepository: IAssignmentRepository,
        private readonly _bucketName: string
    ) {}

    async execute(
        courseId: string,
        chapterId: string,
        lessonId: string,
        teacherId: string
    ): Promise<void> {

        // 1. Find the lesson.
        const lesson = await this._lessonRepository.findById(lessonId);

        if (!lesson) {
            throw new AppError(
                "Lesson not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 2. Validate lesson ownership by chapter.
        if (lesson.chapterId !== chapterId) {
            throw new AppError(
                "Lesson does not belong to this chapter",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 3. Find the chapter.
        const chapter = await this._chapterRepository.findById(chapterId);

        if (!chapter) {
            throw new AppError(
                "Chapter not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 4. Validate chapter ownership by course.
        if (chapter.courseId !== courseId) {
            throw new AppError(
                "Chapter does not belong to this course",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 5. Find the course.
        const course = await this._courseRepository.findById(courseId);

        if (!course) {
            throw new AppError(
                "Course not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 6. Validate teacher ownership.
        if (course.teacherId !== teacherId) {
            throw new AppError(
                "You are not authorized to modify this course",
                HttpStatusCode.FORBIDDEN
            );
        }

        // 7. Validate course status.
        if (!this._courseStatusPolicy.canEdit(course.status)) {
            throw new AppError(
                "This course cannot be modified",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 8. Validate both S3 keys.
        const videoKey = lesson.videoKey;
        const thumbnailKey = lesson.thumbnailKey;

        if (
            videoKey &&
            !this._lessonMediaKeyPolicy.isOwnedByLesson(
                videoKey,
                courseId,
                chapterId,
                lessonId,
                "video"
            )
        ) {
            throw new AppError(
                "Lesson video key is invalid",
                HttpStatusCode.BAD_REQUEST
            );
        }

        if (
            thumbnailKey &&
            !this._lessonMediaKeyPolicy.isOwnedByLesson(
                thumbnailKey,
                courseId,
                chapterId,
                lessonId,
                "thumbnail"
            )
        ) {
            throw new AppError(
                "Lesson thumbnail key is invalid",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 9. Find the associated assignment.
        const assignment =
            await this._assignmentRepository.findByLessonId(lessonId);

        // 10. Delete the associated S3 objects.
        try {
            if (videoKey) {
                await this._s3Client.deleteFile(
                    this._bucketName,
                    videoKey
                );
            }

            if (thumbnailKey) {
                await this._s3Client.deleteFile(
                    this._bucketName,
                    thumbnailKey
                );
            }
        } catch {
            throw new AppError(
                "Unable to delete lesson media. The lesson and assignment were not deleted.",
                HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }

        // 11. Delete the assignment, if present.
        if (assignment?.assignmentId) {
            const assignmentDeleted =
                await this._assignmentRepository.delete(
                    assignment.assignmentId
                );

            if (!assignmentDeleted) {
                throw new AppError(
                    "Lesson media was deleted, but the assignment and lesson could not be deleted.",
                    HttpStatusCode.INTERNAL_SERVER_ERROR
                );
            }
        }

        // 12. Delete the lesson.
        const lessonDeleted =
            await this._lessonRepository.delete(lessonId);

        if (!lessonDeleted) {
            throw new AppError(
                "The lesson could not be deleted. Check the assignment and media cleanup status.",
                HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }
    }
}