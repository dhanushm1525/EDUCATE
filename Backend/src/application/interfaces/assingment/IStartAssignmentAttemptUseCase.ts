
import { AssignmentSubmission } from "../../../domain/entities/AssignmentSubmission";

export interface IStartAssignmentAttemptUseCase {
    execute(
        assignmentId: string,
        userId: string
    ): Promise<AssignmentSubmission>;
}
