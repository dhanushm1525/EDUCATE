
import { IAssignmentRepository } from "../../../domain/repositories/courseRepositories/IAssingmentRepository";

import { IAssignmentSubmissionRepository } from "../../../domain/repositories/courseRepositories/IAssignmentSubmissionRepository";

import { AssignmentSubmissionResultDTO } from "../../dtos/assingment/AssignmentSubmissionResultDTO";

import { IGetAssignmentResultsUseCase } from "../../interfaces/assingment/IGetAssignmentResultsUseCase";

import { AssignmentSubmissionResultMapper } from "../../mappers/AssignmentSubmissionResultMapper";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class GetAssignmentResultsUseCase
    implements IGetAssignmentResultsUseCase {

    constructor(
        private readonly _assignmentRepository: IAssignmentRepository,
        private readonly _submissionRepository: IAssignmentSubmissionRepository
    ) {}

    async execute(
        assignmentId: string,
        userId: string
    ): Promise<AssignmentSubmissionResultDTO[]> {

        // 1. Validate IDs.
        const objectIdPattern = /^[a-f\d]{24}$/i;

        if (
            !objectIdPattern.test(assignmentId) ||
            !objectIdPattern.test(userId)
        ) {
            throw new AppError(
                "Invalid assignment ID or user ID",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 2. Verify assignment exists.
        const assignment =
            await this._assignmentRepository.findById(assignmentId);

        if (!assignment) {
            throw new AppError(
                "Assignment not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 3. Retrieve only this student's submissions.
        const submissions =
            await this._submissionRepository.findByAssignmentAndUser(
                assignmentId,
                userId
            );

        // 4. Sort attempts in chronological order.
        submissions.sort(
            (a, b) => a.attemptNumber - b.attemptNumber
        );

        // 5. Convert domain entities into result DTOs.
        return submissions.map(
            AssignmentSubmissionResultMapper.toDTO
        );
    }
}
