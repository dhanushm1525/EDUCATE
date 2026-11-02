
import { AssignmentSubmission } from "../../entities/AssignmentSubmission";

export interface IAssignmentSubmissionRepository {

    create(
        submission: AssignmentSubmission
    ): Promise<AssignmentSubmission>;

    findById(
        submissionId: string
    ): Promise<AssignmentSubmission | null>;

    findByAssignmentAndUser(
        assignmentId: string,
        userId: string
    ): Promise<AssignmentSubmission[]>;

    findByUserId(
        userId: string
    ): Promise<AssignmentSubmission[]>;

    findByAssignmentId(
        assignmentId: string
    ): Promise<AssignmentSubmission[]>;

    update(
        submissionId: string,
        submission: AssignmentSubmission
    ): Promise<AssignmentSubmission | null>;
}
