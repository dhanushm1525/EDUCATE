
import { TeacherAssignmentDTO } from "../../dtos/assingment/TeacherAssignmentDTO";

export interface IGetTeacherAssignmentsUseCase {
    execute(teacherId: string): Promise<TeacherAssignmentDTO[]>;
}
