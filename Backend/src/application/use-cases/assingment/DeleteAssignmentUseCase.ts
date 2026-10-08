import { IAssignmentRepository } from "../../../domain/repositories/courseRepositories/IAssingmentRepository";
import { ILessonRepository } from "../../../domain/repositories/courseRepositories/ILessonRepository";
import { IChapterRepository } from "../../../domain/repositories/courseRepositories/IChapterRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { IDeleteAssignmentUseCase } from "../../interfaces/assingment/IDeleteAssignmentUseCase";

export class DeleteAssignmentUseCase
    implements IDeleteAssignmentUseCase {

    constructor(
        private readonly _assignmentRepository: IAssignmentRepository,
        private readonly _lessonRepository: ILessonRepository,
        private readonly _chapterRepository: IChapterRepository,
        private readonly _courseRepository: ICourseRepository
    ) {}

    async execute(
        assignmentId: string,
        teacherId: string
    ): Promise<void> {

        const assignment =
            await this._assignmentRepository.findById(
                assignmentId
            );

        if (!assignment) {
            throw new Error("Assignment not found");
        }

        const lesson =
            await this._lessonRepository.findById(
                assignment.lessonId
            );

        if (!lesson) {
            throw new Error("Lesson not found");
        }

        const chapter =
            await this._chapterRepository.findById(
                lesson.chapterId
            );

        if (!chapter) {
            throw new Error("Chapter not found");
        }

        const course =
            await this._courseRepository.findById(
                chapter.courseId
            );

        if (!course) {
            throw new Error("Course not found");
        }

        if (course.teacherId !== teacherId) {
            throw new Error(
                "You are not authorized to delete this assignment"
            );
        }

        const deleted =
            await this._assignmentRepository.delete(
                assignmentId
            );

        if (!deleted) {
            throw new Error(
                "Failed to delete assignment"
            );
        }
    }
}