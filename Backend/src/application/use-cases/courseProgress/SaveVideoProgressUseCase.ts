
import { ICourseProgressRepository } from "../../../domain/repositories/courseRepositories/ICourseProgressRepository";
import { IEnrollmentRepository } from "../../../domain/repositories/courseRepositories/IEnrollmentRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";

import { ISaveVideoProgressUseCase } from "../../interfaces/courseProgress/ISaveVideoProgressUseCase";
import { CourseProgressHelper } from "./CourseProgressHelper";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class SaveVideoProgressUseCase
    implements ISaveVideoProgressUseCase {

    private readonly _helper: CourseProgressHelper;

    constructor(
        private readonly _progressRepository: ICourseProgressRepository,
        enrollmentRepository: IEnrollmentRepository,
        chapterRepository: IChapterRepository,
        lessonRepository: ILessonRepository
    ) {
        this._helper = new CourseProgressHelper(
            enrollmentRepository,
            chapterRepository,
            lessonRepository
        );
    }

    async execute(
        userId: string,
        courseId: string,
        lessonId: string,
        watchPercentage: number
    ): Promise<void> {

        if (
            !Number.isFinite(watchPercentage) ||
            watchPercentage < 0 ||
            watchPercentage > 100
        ) {
            throw new AppError(
                "Invalid video progress percentage",
                HttpStatusCode.BAD_REQUEST
            );
        }

        const { enrollment, lesson } =
            await this._helper.validateLessonAccess(
                userId,
                courseId,
                lessonId
            );

        if (lesson.type !== "video") {
            throw new AppError(
                "Video progress can only be recorded for video lessons",
                HttpStatusCode.BAD_REQUEST
            );
        }

        if (!enrollment.enrollmentId) {
            throw new Error("Enrollment ID is missing");
        }

        const existing =
            await this._progressRepository.findByUserAndCourse(
                userId,
                courseId
            );

        // Do not change progress for an already completed lesson.
        if (
            existing?.completedLessons.some(
                (item) => item.lessonId === lessonId
            )
        ) {
            return;
        }

        const now = new Date();

        if (existing?.progressId) {
            const currentVideoProgress = existing.videoProgress ?? [];

            const previousProgress = currentVideoProgress.find(
                (item) => item.lessonId === lessonId
            );

            const updatedVideoProgress = previousProgress
                ? currentVideoProgress.map((item) =>
                    item.lessonId === lessonId
                        ? {
                            ...item,
                            watchPercentage: Math.max(
                                item.watchPercentage,
                                watchPercentage
                            ),
                            updatedAt: now,
                        }
                        : item
                )
                : [
                    ...currentVideoProgress,
                    {
                        lessonId,
                        watchPercentage,
                        updatedAt: now,
                    },
                ];

            await this._progressRepository.update(
                existing.progressId,
                {
                    videoProgress: updatedVideoProgress,
                }
            );

            return;
        }

        await this._progressRepository.create({
            enrollmentId: enrollment.enrollmentId,
            userId,
            courseId,
            completedLessons: [],
            completedAssignments: [],
            videoProgress: [
                {
                    lessonId,
                    watchPercentage,
                    updatedAt: now,
                },
            ],
            lastAccessedLessonId: lessonId,
            createdAt: now,
            updatedAt: now,
        });
    }
}
