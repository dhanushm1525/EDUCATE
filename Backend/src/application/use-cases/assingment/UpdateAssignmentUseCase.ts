import { Assignment } from "../../../domain/entities/Assingment";
import { IAssignmentRepository } from "../../../domain/repositories/courseRepositories/IAssingmentRepository";
import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories//courseRepositories/ICourseRepository";

import { UpdateAssignmentDTO } from "../../dtos/assingment/UpdateAssignmentDTO";
import { IUpdateAssignmentUseCase } from "../../interfaces/assingment/IUpdateAssignmentUseCase";

export class UpdateAssignmentUseCase
    implements IUpdateAssignmentUseCase {

    constructor(
        private readonly _assignmentRepository: IAssignmentRepository,
        private readonly _lessonRepository: ILessonRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _courseRepository: ICourseRepository
    ) {}

    async execute(
        assignmentId: string,
        dto: UpdateAssignmentDTO,
        teacherId: string
    ): Promise<Assignment> {

        // 1. Find assignment
        const assignment =
            await this._assignmentRepository.findById(
                assignmentId
            );

        if (!assignment) {
            throw new Error("Assignment not found");
        }

        // 2. Find lesson
        const lesson =
            await this._lessonRepository.findById(
                assignment.lessonId
            );

        if (!lesson) {
            throw new Error("Lesson not found");
        }

        // 3. Find chapter
        const chapter =
            await this._chapterRepository.findById(
                lesson.chapterId
            );

        if (!chapter) {
            throw new Error("Chapter not found");
        }

        // 4. Find course
        const course =
            await this._courseRepository.findById(
                chapter.courseId
            );

        if (!course) {
            throw new Error("Course not found");
        }

        // 5. Verify ownership
        if (course.teacherId !== teacherId) {
            throw new Error(
                "You are not authorized to update this assignment"
            );
        }

        // 6. Validate questions if supplied
        let totalMarks = assignment.totalMarks;

        if (dto.questions) {

            if (dto.questions.length === 0) {
                throw new Error(
                    "Assignment must contain at least one question"
                );
            }

            for (const question of dto.questions) {

                if (!question.question?.trim()) {
                    throw new Error(
                        "Question text is required"
                    );
                }

                if (!question.options || question.options.length < 2) {
                    throw new Error(
                        "Each question must contain at least two options"
                    );
                }

                if (
                    !question.options.includes(
                        question.correctAnswer
                    )
                ) {
                    throw new Error(
                        "Correct answer must be one of the options"
                    );
                }

                if (question.marks <= 0) {
                    throw new Error(
                        "Question marks must be greater than zero"
                    );
                }
            }

            // Recalculate total marks
            totalMarks = dto.questions.reduce(
                (total, question) =>
                    total + question.marks,
                0
            );
        }

        // 7. Determine passing marks
        const passingMarks =
            dto.passingMarks ?? assignment.passingMarks;

        if (
            passingMarks <= 0 ||
            passingMarks > totalMarks
        ) {
            throw new Error(
                "Passing marks must be greater than zero and cannot exceed total marks"
            );
        }

        // 8. Update assignment
        const updatedAssignment =
            await this._assignmentRepository.update(
                assignmentId,
                {
                    title: dto.title ?? assignment.title,
                    description:
                        dto.description ?? assignment.description,
                    questions:
                        dto.questions ?? assignment.questions,
                    totalMarks,
                    passingMarks,
                    timeLimit:
                        dto.timeLimit ?? assignment.timeLimit,
                    attemptsAllowed:
                        dto.attemptsAllowed ??
                        assignment.attemptsAllowed,
                    updatedAt: new Date(),
                }
            );

        if (!updatedAssignment) {
            throw new Error(
                "Failed to update assignment"
            );
        }

        return updatedAssignment;
    }
}