import { Assignment } from "../../../domain/entities/Assingment";
import { UpdateAssignmentDTO } from "../../dtos/assingment/UpdateAssignmentDTO";

export interface IUpdateAssignmentUseCase {
    execute(
        assignmentId: string,
        dto: UpdateAssignmentDTO,
        teacherId: string
    ): Promise<Assignment>;
}