import { Assignment } from "../../../domain/entities/Assingment";
import { CreateAssignmentDTO } from "../../dtos/assingment/CreateAssignmentDTO";

export interface ICreateAssignmentUseCase {
    execute(
        dto: CreateAssignmentDTO,
        teacherId: string
    ): Promise<Assignment>;
}