
import { AssignmentSubmission } from "../../../domain/entities/AssignmentSubmission";
import { SubmitAssignmentDTO } from "../../dtos/assingment/SubmitAssignmentDTO";

export interface ISubmitAssignmentUseCase {
    execute(dto: SubmitAssignmentDTO): Promise<AssignmentSubmission>;
}
