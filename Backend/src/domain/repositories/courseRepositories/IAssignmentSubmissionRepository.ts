
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

    findActiveAttempt(
        assignmentId: string,
        userId: string
    ): Promise<AssignmentSubmission | null>;

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

    updateAnswers(
        assignmentId: string,
        userId: string,
        answers: AssignmentSubmission["answers"]
    ): Promise<AssignmentSubmission | null>;
}
