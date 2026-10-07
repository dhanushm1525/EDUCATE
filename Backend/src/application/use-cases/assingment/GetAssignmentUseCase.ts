import { Assignment } from "../../../domain/entities/Assingment";
import { IAssignmentRepository } from "../../../domain/repositories/courseRepositories/IAssingmentRepository";
import { IGetAssignmentUseCase } from "../../interfaces/assingment/IGetAssignmentUseCase";

export class GetAssignmentUseCase
    implements IGetAssignmentUseCase {

    constructor(
        private readonly _assignmentRepository: IAssignmentRepository
    ) {}

    async execute(lessonId: string): Promise<Assignment> {
        const assignment =
            await this._assignmentRepository.findByLessonId(
                lessonId
            );

        if (!assignment) {
            throw new Error("Assignment not found");
        }

        return assignment;
    }
}