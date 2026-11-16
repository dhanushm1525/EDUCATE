
import { IAssignmentRepository } from "../../../domain/repositories/courseRepositories/IAssingmentRepository";
import { IAssignmentSubmissionRepository } from "../../../domain/repositories/courseRepositories/IAssignmentSubmissionRepository";
import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";
import { IUserRepository } from "../../../domain/repositories/userRepositories/IUserRepository";

import {
    AssignmentSubmission,
    SubmissionStatus
} from "../../../domain/entities/AssignmentSubmission";

import { TeacherAssignmentSubmissionDTO } from "../../dtos/assingment/TeacherAssignmentSubmissionDTO";
import { IGetTeacherAssignmentSubmissionsUseCase } from "../../interfaces/assingment/IGetTeacherAssignmentSubmissionsUseCase";
import { TeacherAssignmentSubmissionMapper } from "../../mappers/TeacherAssignmentSubmissionMapper";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class GetTeacherAssignmentSubmissionsUseCase
    implements IGetTeacherAssignmentSubmissionsUseCase {

    constructor(
        private readonly _assignmentRepository: IAssignmentRepository,
        private readonly _submissionRepository: IAssignmentSubmissionRepository,
        private readonly _lessonRepository: ILessonRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _courseRepository: ICourseRepository,
        private readonly _userRepository: IUserRepository
    ) { }

    async execute(
        assignmentId: string,
        teacherId: string
    ): Promise<TeacherAssignmentSubmissionDTO[]> {

        const objectIdPattern = /^[a-f\d]{24}$/i;

        if (
            !objectIdPattern.test(assignmentId) ||
            !objectIdPattern.test(teacherId)
        ) {
            throw new AppError(
                "Invalid assignment ID or teacher ID",
                HttpStatusCode.BAD_REQUEST
            );
        }

        const assignment =
            await this._assignmentRepository.findById(assignmentId);

        if (!assignment) {
            throw new AppError(
                "Assignment not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        const lesson =
            await this._lessonRepository.findById(assignment.lessonId);

        if (!lesson) {
            throw new AppError(
                "Lesson not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        const chapter =
            await this._chapterRepository.findById(lesson.chapterId);

        if (!chapter) {
            throw new AppError(
                "Chapter not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        const course =
            await this._courseRepository.findById(chapter.courseId);

        if (!course) {
            throw new AppError(
                "Course not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        if (course.teacherId !== teacherId) {
            throw new AppError(
                "You are not authorized to view these submissions",
                HttpStatusCode.FORBIDDEN
            );
        }

        const submissions =
            await this._submissionRepository.findByAssignmentId(
                assignmentId
            );

        // Only completed submissions should appear in teacher results.
        const completedSubmissions = submissions.filter(
            (
                submission
            ): submission is AssignmentSubmission & {
                submittedAt: Date;
            } =>
                submission.submittedAt instanceof Date &&
                (
                    submission.status === SubmissionStatus.SUBMITTED ||
                    submission.status === SubmissionStatus.GRADED
                )
        );

        if (completedSubmissions.length === 0) {
            return [];
        }

        const studentIds = [
            ...new Set(
                completedSubmissions.map(
                    submission => submission.userId
                )
            )
        ];

        const students =
            await this._userRepository.findByIds(studentIds);

        const studentMap = new Map(
            students.map(student => [student.id, student])
        );

        completedSubmissions.sort(
            (a, b) =>
                b.submittedAt.getTime() - a.submittedAt.getTime()
        );

        return completedSubmissions.map(submission => {

            const student = studentMap.get(submission.userId);

            if (!student) {
                throw new AppError(
                    "Student information not found for a submission",
                    HttpStatusCode.INTERNAL_SERVER_ERROR
                );
            }

            return TeacherAssignmentSubmissionMapper.toDTO(
                submission,
                student
            );
        });
    }
}
