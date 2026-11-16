
import { AssignmentSubmission } from "../../../domain/entities/AssignmentSubmission";
import { SaveAssignmentAnswersDTO } from "../../dtos/assingment/SaveAssignmentAnswersDTO";

export interface ISaveAssignmentAnswersUseCase {
    execute(dto: SaveAssignmentAnswersDTO): Promise<AssignmentSubmission>;
}
