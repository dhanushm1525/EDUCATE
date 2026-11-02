
import { AssignmentSubmission } from "../../../domain/entities/AssignmentSubmission";

import { GradeAssignmentSubmissionDTO } from "../../dtos/assingment/GradeAssignmentSubmissionDTO";

export interface IGradeAssignmentSubmissionUseCase {

    execute(
        dto: GradeAssignmentSubmissionDTO
    ): Promise<AssignmentSubmission>;
}
