import {
  AssignmentSubmission,
  AssignmentSubmissionAnswer,
  SubmissionStatus,
} from "../../../domain/entities/AssignmentSubmission";

import { EnrollmentStatus } from "../../../domain/entities/Enrollment";

import { IAssignmentRepository } from "../../../domain/repositories/courseRepositories/IAssingmentRepository";
import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";
import { IEnrollmentRepository } from "../../../domain/repositories/courseRepositories/IEnrollmentRepository";
import { IAssignmentSubmissionRepository } from "../../../domain/repositories/courseRepositories/IAssignmentSubmissionRepository";

import { SaveAssignmentAnswersDTO } from "../../dtos/assingment/SaveAssignmentAnswersDTO";
import { ISaveAssignmentAnswersUseCase } from "../../interfaces/assingment/ISaveAssignmentAnswersUseCase";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class SaveAssignmentAnswersUseCase implements ISaveAssignmentAnswersUseCase {
  constructor(
    private readonly _assignmentRepository: IAssignmentRepository,
    private readonly _lessonRepository: ILessonRepository,
    private readonly _chapterRepository: IChapterRepository,
    private readonly _courseRepository: ICourseRepository,
    private readonly _enrollmentRepository: IEnrollmentRepository,
    private readonly _submissionRepository: IAssignmentSubmissionRepository,
  ) {}

  async execute(dto: SaveAssignmentAnswersDTO): Promise<AssignmentSubmission> {
    const { assignmentId, userId, submissionId, answers } = dto;

    // 1. Validate IDs.
    const objectIdPattern = /^[a-f\d]{24}$/i;

    if (
      !objectIdPattern.test(assignmentId) ||
      !objectIdPattern.test(userId) ||
      !objectIdPattern.test(submissionId)
    ) {
      throw new AppError("Invalid assignment, user or submission ID", HttpStatusCode.BAD_REQUEST);
    }

    // 2. Validate payload.
    if (!Array.isArray(answers)) {
      throw new AppError("Invalid answers payload", HttpStatusCode.BAD_REQUEST);
    }

    // 3. Find assignment.
    const assignment = await this._assignmentRepository.findById(assignmentId);

    if (!assignment || !assignment.assignmentId) {
      throw new AppError("Assignment not found", HttpStatusCode.NOT_FOUND);
    }

    // 4. Find lesson, chapter and course.
    const lesson = await this._lessonRepository.findById(assignment.lessonId);

    if (!lesson) {
      throw new AppError("Lesson not found", HttpStatusCode.NOT_FOUND);
    }

    const chapter = await this._chapterRepository.findById(lesson.chapterId);

    if (!chapter) {
      throw new AppError("Chapter not found", HttpStatusCode.NOT_FOUND);
    }

    const course = await this._courseRepository.findById(chapter.courseId);

    if (!course) {
      throw new AppError("Course not found", HttpStatusCode.NOT_FOUND);
    }

    // 5. Verify active enrollment.
    const enrollment = await this._enrollmentRepository.findByUserAndCourse(
      userId,
      chapter.courseId,
    );

    if (!enrollment || enrollment.status !== EnrollmentStatus.ACTIVE) {
      throw new AppError(
        "You must be actively enrolled to save assignment answers",
        HttpStatusCode.FORBIDDEN,
      );
    }

    // 6. Find the active attempt.
    const activeAttempt = await this._submissionRepository.findActiveAttempt(assignmentId, userId);

    if (!activeAttempt || !activeAttempt.submissionId) {
      throw new AppError("No active assignment attempt found", HttpStatusCode.BAD_REQUEST);
    }

    // 7. Verify that the requested submission is the active attempt.
    if (activeAttempt.submissionId !== submissionId) {
      throw new AppError(
        "The requested submission is not the active attempt",
        HttpStatusCode.BAD_REQUEST,
      );
    }

    const now = new Date();

    // 8. Check attempt expiry and assignment deadline.
    const attemptExpired =
      activeAttempt.expiresAt !== undefined && now.getTime() >= activeAttempt.expiresAt.getTime();

    const deadlinePassed =
      assignment.dueDate != null && now.getTime() >= assignment.dueDate.getTime();

    if (attemptExpired || deadlinePassed) {
      await this._submissionRepository.update(activeAttempt.submissionId, {
        ...activeAttempt,
        status: SubmissionStatus.EXPIRED,
        updatedAt: now,
      });

      throw new AppError("Your assignment attempt has expired", HttpStatusCode.BAD_REQUEST);
    }

    // 9. Validate question IDs and prevent duplicates.
    const questionMap = new Map(
      assignment.questions.map((question) => [question.questionId, question]),
    );

    const submittedQuestionIds = new Set<string>();

    const validatedAnswers: AssignmentSubmissionAnswer[] = [];

    for (const answer of answers) {
      if (
        !answer ||
        typeof answer.questionId !== "string" ||
        !answer.questionId.trim() ||
        typeof answer.selectedAnswer !== "string" ||
        !answer.selectedAnswer.trim()
      ) {
        throw new AppError("Invalid answer data", HttpStatusCode.BAD_REQUEST);
      }

      const questionId = answer.questionId.trim();
      const selectedAnswer = answer.selectedAnswer.trim();

      if (submittedQuestionIds.has(questionId)) {
        throw new AppError(
          "Duplicate question answers are not allowed",
          HttpStatusCode.BAD_REQUEST,
        );
      }

      const question = questionMap.get(questionId);

      if (!question) {
        throw new AppError("An invalid question was submitted", HttpStatusCode.BAD_REQUEST);
      }

      if (!question.options.includes(selectedAnswer)) {
        throw new AppError("An invalid option was selected", HttpStatusCode.BAD_REQUEST);
      }

      submittedQuestionIds.add(questionId);

      validatedAnswers.push({
        questionId,
        selectedAnswer,
      });
    }

    // 10. Save answers to the exact active attempt.
    const savedSubmission = await this._submissionRepository.updateAnswers(
      assignmentId,
      userId,
      submissionId,
      validatedAnswers,
    );

    if (!savedSubmission) {
      throw new AppError(
        "Unable to save answers. Your attempt may have expired or is no longer active.",
        HttpStatusCode.BAD_REQUEST,
      );
    }

    return savedSubmission;
  }
}
