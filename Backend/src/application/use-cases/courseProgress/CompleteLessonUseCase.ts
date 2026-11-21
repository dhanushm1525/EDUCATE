import { ICourseProgressRepository } from "../../../domain/repositories/courseRepositories/ICourseProgressRepository";
import { IEnrollmentRepository } from "../../../domain/repositories/courseRepositories/IEnrollmentRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";

import { ICompleteLessonUseCase } from "../../interfaces/courseProgress/ICompleteLessonUseCase";
import { CourseProgressHelper } from "./CourseProgressHelper";

export class CompleteLessonUseCase implements ICompleteLessonUseCase {
  private readonly _helper: CourseProgressHelper;

  constructor(
    private readonly _progressRepository: ICourseProgressRepository,
    enrollmentRepository: IEnrollmentRepository,
    chapterRepository: IChapterRepository,
    lessonRepository: ILessonRepository,
  ) {
    this._helper = new CourseProgressHelper(
      enrollmentRepository,
      chapterRepository,
      lessonRepository,
    );
  }

  async execute(userId: string, courseId: string, lessonId: string): Promise<void> {
    const { enrollment } = await this._helper.validateLessonAccess(userId, courseId, lessonId);

    if (!enrollment.enrollmentId) {
      throw new Error("Enrollment ID is missing");
    }

    const existing = await this._progressRepository.findByUserAndCourse(userId, courseId);

    if (existing?.progressId) {
      const alreadyCompleted = existing.completedLessons.some((item) => item.lessonId === lessonId);

      const completedLessons = alreadyCompleted
        ? existing.completedLessons
        : [
            ...existing.completedLessons,
            {
              lessonId,
              completedAt: new Date(),
            },
          ];

      await this._progressRepository.update(existing.progressId, {
        completedLessons,
        lastAccessedLessonId: lessonId,
      });

      return;
    }

    await this._progressRepository.create({
      enrollmentId: enrollment.enrollmentId,
      userId,
      courseId,
      completedLessons: [
        {
          lessonId,
          completedAt: new Date(),
        },
      ],
      completedAssignments: [],
      videoProgress: [],
      lastAccessedLessonId: lessonId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
