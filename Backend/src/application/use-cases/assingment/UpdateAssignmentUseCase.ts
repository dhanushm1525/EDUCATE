import { IAssignmentRepository } from "../../../domain/repositories/courseRepositories/IAssingmentRepository";
import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { IUpdateAssignmentUseCase } from "../../interfaces/assingment/IUpdateAssignmentUseCase";
import { UpdateAssignmentDTO } from "../../dtos/assingment/UpdateAssignmentDTO";

import { Assignment } from "../../../domain/entities/Assingment";
import { AssignmentPolicy } from "../../../domain/policies/AssignmentPolicy";

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

        const existingAssignment =
            await this._assignmentRepository.findById(
                assignmentId
            );

        if (!existingAssignment) {
            throw new AppError(
                "Assignment not found",
                HttpStatusCode.NOT_FOUND
            );
        }

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

        if (course.teacherId !== teacherId) {
            throw new AppError(
                "You are not authorized to update this assignment",
                HttpStatusCode.FORBIDDEN
            );
        }

        const title =
            dto.title !== undefined
                ? dto.title.trim()
                : existingAssignment.title;

        const questions =
            dto.questions ??
            existingAssignment.questions;

        const passingMarks =
            dto.passingMarks ??
            existingAssignment.passingMarks;

        const timeLimit =
            dto.timeLimit !== undefined
                ? dto.timeLimit
                : existingAssignment.timeLimit;

        const attemptsAllowed =
            dto.attemptsAllowed !== undefined
                ? dto.attemptsAllowed
                : existingAssignment.attemptsAllowed;

        const totalMarks =
            AssignmentPolicy.validate(
                title,
                questions,
                passingMarks,
                timeLimit,
                attemptsAllowed
            );

        const updateData: Partial<Assignment> = {
            title,

            description:
                dto.description !== undefined
                    ? dto.description
                    : existingAssignment.description,

            questions,

            totalMarks,

            passingMarks,

            timeLimit,

            attemptsAllowed,

            updatedAt: new Date(),
        };

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