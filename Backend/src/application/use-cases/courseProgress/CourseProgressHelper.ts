import { EnrollmentStatus } from "../../../domain/entities/Enrollment";
import { IEnrollmentRepository } from "../../../domain/repositories/courseRepositories/IEnrollmentRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class CourseProgressHelper {
  constructor(
    private readonly _enrollmentRepository: IEnrollmentRepository,
    private readonly _chapterRepository: IChapterRepository,
    private readonly _lessonRepository: ILessonRepository,
  ) {}

  async validateLessonAccess(userId: string, courseId: string, lessonId: string) {
    if (
      !/^[a-f\d]{24}$/i.test(userId) ||
      !/^[a-f\d]{24}$/i.test(courseId) ||
      !/^[a-f\d]{24}$/i.test(lessonId)
    ) {
      throw new AppError("Invalid ID", HttpStatusCode.BAD_REQUEST);
    }

    const enrollment = await this._enrollmentRepository.findByUserAndCourse(userId, courseId);

    if (!enrollment || enrollment.status !== EnrollmentStatus.ACTIVE) {
      throw new AppError("Active course enrollment required", HttpStatusCode.FORBIDDEN);
    }

    const lesson = await this._lessonRepository.findById(lessonId);

    if (!lesson) {
      throw new AppError("Lesson not found", HttpStatusCode.NOT_FOUND);
    }

    const chapter = await this._chapterRepository.findById(lesson.chapterId);

    if (!chapter || chapter.courseId !== courseId) {
      throw new AppError("Lesson does not belong to this course", HttpStatusCode.BAD_REQUEST);
    }

    return { enrollment, lesson };
  }
}
