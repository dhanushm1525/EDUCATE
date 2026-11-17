
import { AssignmentSubmissionAnswer } from "../../../domain/entities/AssignmentSubmission";

export interface SaveAssignmentAnswersDTO {
    assignmentId: string;
    userId: string;
    submissionId: string;
    answers: AssignmentSubmissionAnswer[];
}
