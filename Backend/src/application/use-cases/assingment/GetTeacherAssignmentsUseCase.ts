
import { IAssignmentRepository } from "../../../domain/repositories/courseRepositories/IAssingmentRepository";
import { IAssignmentSubmissionRepository } from "../../../domain/repositories/courseRepositories/IAssignmentSubmissionRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";

import { TeacherAssignmentDTO } from "../../dtos/assingment/TeacherAssignmentDTO";
import { IGetTeacherAssignmentsUseCase } from "../../interfaces/assingment/IGetTeacherAssignmentsUseCase";

import { SubmissionStatus } from "../../../domain/entities/AssignmentSubmission";
import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class GetTeacherAssignmentsUseCase
    implements IGetTeacherAssignmentsUseCase {

    constructor(
        private readonly _assignmentRepository: IAssignmentRepository,
        private readonly _submissionRepository: IAssignmentSubmissionRepository,
        private readonly _courseRepository: ICourseRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _lessonRepository: ILessonRepository
    ) {}

    async execute(
        teacherId: string
    ): Promise<TeacherAssignmentDTO[]> {

        if (!/^[0-9a-fA-F]{24}$/.test(teacherId)) {
            throw new AppError(
                "Invalid teacher ID",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 1. Get all courses belonging to this teacher.
        const courses =
            await this._courseRepository.findByTeacherId(teacherId);

        if (courses.length === 0) {
            return [];
        }

        // 2. Get chapters for all courses.
        const chapterGroups = await Promise.all(
            courses.map(course =>
                this._chapterRepository.findByCourseId(
                    course.courseId!
                )
            )
        );

        const chapterContexts = chapterGroups.flatMap(
            (chapters, index) =>
                chapters.map(chapter => ({
                    chapter,
                    course: courses[index]
                }))
        );

        if (chapterContexts.length === 0) {
            return [];
        }

        // 3. Get lessons for all chapters.
        const lessonGroups = await Promise.all(
            chapterContexts.map(context =>
                this._lessonRepository.findByChapterId(
                    context.chapter.chapterId!
                )
            )
        );

        const lessonContexts = lessonGroups.flatMap(
            (lessons, index) =>
                lessons.map(lesson => ({
                    lesson,
                    chapter: chapterContexts[index].chapter,
                    course: chapterContexts[index].course
                }))
        );

        if (lessonContexts.length === 0) {
            return [];
        }

        // 4. Retrieve all assignments using their lesson IDs.
        const lessonIds = lessonContexts
            .map(context => context.lesson.lessonId)
            .filter((id): id is string => Boolean(id));

        const assignments =
            await this._assignmentRepository.findByLessonIds(lessonIds);

        if (assignments.length === 0) {
            return [];
        }

        // 5. Create a lookup for lesson, chapter and course details.
        const lessonContextMap = new Map(
            lessonContexts.map(context => [
                context.lesson.lessonId!,
                context
            ])
        );

        // 6. Get submission information for all assignments.
        const submissionGroups = await Promise.all(
            assignments.map(assignment =>
                this._submissionRepository.findByAssignmentId(
                    assignment.assignmentId!
                )
            )
        );

        // 7. Build the teacher assignment overview DTOs.
        return assignments.flatMap((assignment, index) => {

            const context = lessonContextMap.get(assignment.lessonId);

            if (
                !context ||
                !assignment.assignmentId ||
                !context.lesson.lessonId ||
                !context.chapter.chapterId ||
                !context.course.courseId
            ) {
                return [];
            }

            const submissions = submissionGroups[index];

            const gradedSubmissions = submissions.filter(
                submission =>
                    submission.status === SubmissionStatus.GRADED
            ).length;

            const totalSubmissions = submissions.length;

            return [{
                assignmentId: assignment.assignmentId,
                title: assignment.title,
                description: assignment.description,

                courseId: context.course.courseId,
                courseTitle: context.course.title,

                chapterId: context.chapter.chapterId,
                chapterTitle: context.chapter.title,

                lessonId: context.lesson.lessonId,
                lessonTitle: context.lesson.title,

                totalQuestions: assignment.questions.length,
                totalMarks: assignment.totalMarks,
                passingMarks: assignment.passingMarks,

                timeLimit: assignment.timeLimit,
                attemptsAllowed: assignment.attemptsAllowed,
                dueDate: assignment.dueDate,

                totalSubmissions,
                gradedSubmissions,
                pendingSubmissions:
                    totalSubmissions - gradedSubmissions,

                createdAt: assignment.createdAt,
                updatedAt: assignment.updatedAt
            }];
        });
    }
}
