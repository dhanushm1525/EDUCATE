
import { IAssignmentRepository } from "../../../domain/repositories/courseRepositories/IAssingmentRepository";

import { IAssignmentSubmissionRepository } from "../../../domain/repositories/courseRepositories/IAssignmentSubmissionRepository";

import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";

import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";

import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { IUserRepository } from "../../../domain/repositories/userRepositories/IUserRepository";

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
    ) {}

    async execute(
        assignmentId: string,
        teacherId: string
    ): Promise<TeacherAssignmentSubmissionDTO[]> {

        // 1. Validate IDs.
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

        // 2. Find assignment.
        const assignment =
            await this._assignmentRepository.findById(assignmentId);

        if (!assignment) {
            throw new AppError(
                "Assignment not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 3. Find lesson.
        const lesson =
            await this._lessonRepository.findById(assignment.lessonId);

        if (!lesson) {
            throw new AppError(
                "Lesson not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 4. Find chapter.
        const chapter =
            await this._chapterRepository.findById(lesson.chapterId);

        if (!chapter) {
            throw new AppError(
                "Chapter not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 5. Find course.
        const course =
            await this._courseRepository.findById(chapter.courseId);

        if (!course) {
            throw new AppError(
                "Course not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 6. Verify teacher ownership.
        if (course.teacherId !== teacherId) {
            throw new AppError(
                "You are not authorized to view these submissions",
                HttpStatusCode.FORBIDDEN
            );
        }

        // 7. Retrieve all submissions for this assignment.
        const submissions =
            await this._submissionRepository.findByAssignmentId(
                assignmentId
            );

        if (submissions.length === 0) {
            return [];
        }

        // 8. Retrieve all unique student IDs.
        const studentIds = [
            ...new Set(
                submissions.map(submission => submission.userId)
            )
        ];

        // 9. Fetch all students in one database query.
        const students =
            await this._userRepository.findByIds(studentIds);

        // 10. Create a lookup map for students.
        const studentMap = new Map(
            students.map(student => [student.id, student])
        );

        // 11. Sort submissions by newest first.
        submissions.sort(
            (a, b) =>
                b.submittedAt.getTime() - a.submittedAt.getTime()
        );

        // 12. Map submissions into teacher DTOs.
        return submissions.map(submission => {

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
