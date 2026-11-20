
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
import { IAssignmentRepository } from "../../../domain/repositories/courseRepositories/IAssingmentRepository";

export class GetMyCourseProgressUseCase
    implements IGetMyCourseProgressUseCase {

    constructor(
        private readonly _progressRepository: ICourseProgressRepository,
        private readonly _enrollmentRepository: IEnrollmentRepository,
        private readonly _courseRepository: ICourseRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _lessonRepository: ILessonRepository,
        private readonly _assignmentRepository: IAssignmentRepository
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

                const lessonIds = lessons
                    .map(lesson => lesson.lessonId)
                    .filter((id): id is string => Boolean(id));

                const [progress, assignments] = await Promise.all([
                    this._progressRepository.findByUserAndCourse(
                        userId,
                        enrollment.courseId
                    ),
                    this._assignmentRepository.findByLessonIds(lessonIds)
                ]);

                const validLessonIds = new Set(lessonIds);

                const completedLessons = (
                    progress?.completedLessons ?? []
                ).filter(item => validLessonIds.has(item.lessonId));

                const completedLessonIds = [
                    ...new Set(completedLessons.map(item => item.lessonId))
                ];

                const totalLessons = lessonIds.length;
                const completedLessonCount = completedLessonIds.length;

                // Older assignments without isRequired are treated as required.
                const requiredAssignments = assignments.filter(
                    assignment => assignment.isRequired !== false
                );

                const requiredAssignmentIds = new Set(
                    requiredAssignments
                        .map(assignment => assignment.assignmentId)
                        .filter((id): id is string => Boolean(id))
                );

                const completedAssignmentIds = [
                    ...new Set(
                        (progress?.completedAssignments ?? [])
                            .filter(item => requiredAssignmentIds.has(item.assignmentId))
                            .map(item => item.assignmentId)
                    )
                ];

                const totalRequiredAssignments = requiredAssignments.length;
                const completedRequiredAssignments =
                    completedAssignmentIds.length;

                const remainingLessons = Math.max(
                    totalLessons - completedLessonCount,
                    0
                );

                const remainingRequiredAssignments = Math.max(
                    totalRequiredAssignments - completedRequiredAssignments,
                    0
                );

                const totalItems =
                    totalLessons + totalRequiredAssignments;

                const completedItems =
                    completedLessonCount + completedRequiredAssignments;

                const isCompleted =
                    totalItems > 0 && completedItems === totalItems;

                const progressPercentage = totalItems > 0
                    ? Math.round((completedItems / totalItems) * 100)
                    : 0;

                return {
                    enrollmentId: enrollment.enrollmentId,
                    courseId: enrollment.courseId,
                    courseTitle: course.title,

                    totalLessons,
                    completedLessons: completedLessonCount,
                    remainingLessons,

                    totalRequiredAssignments,
                    completedRequiredAssignments,
                    remainingRequiredAssignments,

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
                    completedAssignmentIds,
                };
            })
        );

        return results.filter(
            (item): item is CourseProgressDTO => item !== null
        );
    }
}
