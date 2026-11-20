
import { ICourseProgressRepository } from "../../../domain/repositories/courseRepositories/ICourseProgressRepository";
import { IEnrollmentRepository } from "../../../domain/repositories/courseRepositories/IEnrollmentRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";

import { IGetMyCourseProgressUseCase } from "../../interfaces/courseProgress/IGetMyCourseProgressUseCase";
import { CourseProgressDTO } from "../../dtos/courseProgress/CourseProgressDTO";

import { EnrollmentStatus } from "../../../domain/entities/Enrollment";
import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class GetMyCourseProgressUseCase
    implements IGetMyCourseProgressUseCase {

    constructor(
        private readonly _progressRepository: ICourseProgressRepository,
        private readonly _enrollmentRepository: IEnrollmentRepository,
        private readonly _courseRepository: ICourseRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _lessonRepository: ILessonRepository
    ) { }

    async execute(userId: string): Promise<CourseProgressDTO[]> {

        if (!/^[a-f\d]{24}$/i.test(userId)) {
            throw new AppError(
                "Invalid user ID",
                HttpStatusCode.BAD_REQUEST
            );
        }

        const enrollments = await this._enrollmentRepository.findByUserId(userId);

        const activeEnrollments = enrollments.filter(
            item => item.status === EnrollmentStatus.ACTIVE
        );

        const results = await Promise.all(
            activeEnrollments.map(async (enrollment): Promise<CourseProgressDTO | null> => {

                const course = await this._courseRepository.findById(
                    enrollment.courseId
                );

                if (!course || !enrollment.enrollmentId) {
                    return null;
                }

                const chapters = await this._chapterRepository.findByCourseId(
                    enrollment.courseId
                );

                const lessonsByChapter = await Promise.all(
                    chapters.map(chapter => {
                        if (!chapter.chapterId) {
                            return Promise.resolve([]);
                        }

                        return this._lessonRepository.findByChapterId(
                            chapter.chapterId
                        );
                    })
                );

                const lessons = lessonsByChapter.flat();

                const progress =
                    await this._progressRepository.findByUserAndCourse(
                        userId,
                        enrollment.courseId
                    );

                const validLessonIds = new Set(
                    lessons
                        .map(lesson => lesson.lessonId)
                        .filter((id): id is string => Boolean(id))
                );

                const completedLessons = (
                    progress?.completedLessons ?? []
                ).filter(item => validLessonIds.has(item.lessonId));

                const completedLessonIds = completedLessons.map(
                    item => item.lessonId
                );

                const totalLessons = lessons.filter(
                    lesson => Boolean(lesson.lessonId)
                ).length;

                const completedCount = completedLessonIds.length;

                const remainingLessons = Math.max(
                    totalLessons - completedCount,
                    0
                );

                const isCompleted =
                    totalLessons > 0 &&
                    completedCount === totalLessons;

                const progressPercentage = totalLessons > 0
                    ? Math.round((completedCount / totalLessons) * 100)
                    : 0;

                return {
                    enrollmentId: enrollment.enrollmentId,
                    courseId: enrollment.courseId,
                    courseTitle: course.title,
                    totalLessons,
                    completedLessons: completedCount,
                    remainingLessons,
                    progressPercentage,
                    ...(progress?.lastAccessedLessonId
                        ? {
                            lastAccessedLessonId: progress.lastAccessedLessonId,
                        }
                        : {}),
                    isCompleted,
                    ...(isCompleted && progress?.completedAt
                        ? { completedAt: progress.completedAt }
                        : {}),
                    completedLessonIds,
                };
            })
        );

        return results.filter(
            (item): item is CourseProgressDTO => item !== null
        );
    }
}
