import { IAssignmentRepository } from "../../../domain/repositories/courseRepositories/IAssingmentRepository";
import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { ICreateAssignmentUseCase } from "../../interfaces/assingment/ICreateAssignmentUseCase";
import { CreateAssignmentDTO } from "../../dtos/assingment/CreateAssignmentDTO";

import { Assignment } from "../../../domain/entities/Assingment";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class CreateAssignmentUseCase
    implements ICreateAssignmentUseCase {

    constructor(
        private readonly _assignmentRepository: IAssignmentRepository,
        private readonly _lessonRepository: ILessonRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _courseRepository: ICourseRepository
    ) { }

    async execute(
        dto: CreateAssignmentDTO,
        teacherId: string
    ): Promise<Assignment> {


        const lesson =
            await this._lessonRepository.findById(
                dto.lessonId
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
                "You are not authorized to create an assignment for this course",
                HttpStatusCode.FORBIDDEN
            );
        }


        const existingAssignment =
            await this._assignmentRepository.findByLessonId(dto.lessonId);

        if (existingAssignment) {
            throw new AppError(
                "An assignment already exists for this lesson"
            );
        }


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
 

        const totalMarks = dto.questions.reduce(
            (total, question) => total + question.marks,
            0
        );


        if (dto.totalMarks !== totalMarks) {
            throw new AppError(
                "Total marks must match the sum of question marks",
                HttpStatusCode.BAD_REQUEST
            );
        }


        if (
            dto.passingMarks <= 0 ||
            dto.passingMarks > totalMarks
        ) {
            throw new AppError(
                "Passing marks must be greater than zero and cannot exceed total marks",
                HttpStatusCode.BAD_REQUEST
            );
        }


        const now = new Date();

        const assignment: Assignment = {
            lessonId: dto.lessonId,

            title: dto.title,
            description: dto.description,

            questions: dto.questions,

            totalMarks: totalMarks,
            passingMarks: dto.passingMarks,

            timeLimit: dto.timeLimit,
            attemptsAllowed: dto.attemptsAllowed,

            createdAt: now,
            updatedAt: now,
        };


        return await this._assignmentRepository.create(
            assignment
        );
    }
}