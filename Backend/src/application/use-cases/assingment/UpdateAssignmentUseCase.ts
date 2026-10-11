import { IAssignmentRepository } from "../../../domain/repositories/courseRepositories/IAssingmentRepository";
import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { IUpdateAssignmentUseCase } from "../../interfaces/assingment/IUpdateAssignmentUseCase";
import { UpdateAssignmentDTO } from "../../dtos/assingment/UpdateAssignmentDTO";

import { Assignment } from "../../../domain/entities/Assingment";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class UpdateAssignmentUseCase
    implements IUpdateAssignmentUseCase {

    constructor(
        private readonly _assignmentRepository: IAssignmentRepository,
        private readonly _lessonRepository: ILessonRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _courseRepository: ICourseRepository
    ) { }

    async execute(
        assignmentId: string,
        dto: UpdateAssignmentDTO,
        teacherId: string
    ): Promise<Assignment> {

        // 1. Find assignment
        const existingAssignment =
            await this._assignmentRepository.findById(assignmentId);

        if (!existingAssignment) {
            throw new AppError(
                "Assignment not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 2. Find lesson
        const lesson =
            await this._lessonRepository.findById(
                existingAssignment.lessonId
            );

        if (!lesson) {
            throw new AppError(
                "Lesson not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 3. Find chapter
        const chapter =
            await this._chapterRepository.findById(
                lesson.chapterId
            );

        if (!chapter) {
            throw new AppError(
                "Chapter not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 4. Find course
        const course =
            await this._courseRepository.findById(
                chapter.courseId
            );

        if (!course) {
            throw new AppError(
                "Course not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 5. Check ownership
        if (course.teacherId !== teacherId) {
            throw new AppError(
                "You are not authorized to update this assignment",
                HttpStatusCode.FORBIDDEN
            );
        }

        // 6. Validate title if provided
        if (
            dto.title !== undefined &&
            !dto.title.trim()
        ) {
            throw new AppError(
                "Assignment title is required",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 7. Validate questions if provided
        if (dto.questions !== undefined) {

            if (dto.questions.length === 0) {
                throw new AppError(
                    "Assignment must contain at least one question",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            for (const question of dto.questions) {

                if (!question.question.trim()) {
                    throw new AppError(
                        "Question cannot be empty",
                        HttpStatusCode.BAD_REQUEST
                    );
                }

                if (question.options.length < 2) {
                    throw new AppError(
                        "Each question must contain at least two options",
                        HttpStatusCode.BAD_REQUEST
                    );
                }

                if (
                    !question.options.includes(
                        question.correctAnswer
                    )
                ) {
                    throw new AppError(
                        "Correct answer must be one of the available options",
                        HttpStatusCode.BAD_REQUEST
                    );
                }

                if (question.marks <= 0) {
                    throw new AppError(
                        "Question marks must be greater than zero",
                        HttpStatusCode.BAD_REQUEST
                    );
                }
            }
        }

        // 8. Determine final questions
        const questions =
            dto.questions ?? existingAssignment.questions;

        // 9. Calculate total marks
        const totalMarks = questions.reduce(
            (total, question) =>
                total + question.marks,
            0
        );

        // 10. Determine final passing marks
        const passingMarks =
            dto.passingMarks ??
            existingAssignment.passingMarks;

        if (
            passingMarks <= 0 ||
            passingMarks > totalMarks
        ) {
            throw new AppError(
                "Passing marks must be greater than zero and cannot exceed total marks",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 11. Build update object
        const updateData: Partial<Assignment> = {
            title:
                dto.title !== undefined
                    ? dto.title.trim()
                    : existingAssignment.title,

            description:
                dto.description !== undefined
                    ? dto.description
                    : existingAssignment.description,

            questions,

            totalMarks,

            passingMarks,

            timeLimit:
                dto.timeLimit !== undefined
                    ? dto.timeLimit
                    : existingAssignment.timeLimit,

            attemptsAllowed:
                dto.attemptsAllowed !== undefined
                    ? dto.attemptsAllowed
                    : existingAssignment.attemptsAllowed,

            updatedAt: new Date(),
        };

        // 12. Update assignment
        const updatedAssignment =
            await this._assignmentRepository.update(
                assignmentId,
                updateData
            );

        if (!updatedAssignment) {
            throw new AppError(
                "Failed to update assignment",
                HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }

        return updatedAssignment;
    }
}