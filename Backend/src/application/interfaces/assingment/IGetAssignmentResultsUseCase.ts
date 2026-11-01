
import { AssignmentSubmissionResultDTO } from "../../dtos/assingment/AssignmentSubmissionResultDTO";

export interface IGetAssignmentResultsUseCase {
    execute(
        assignmentId: string,
        userId: string
    ): Promise<AssignmentSubmissionResultDTO[]>;
}
