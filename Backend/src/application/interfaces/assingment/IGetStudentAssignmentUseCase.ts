
import { StudentAssignmentDTO } from "../../dtos/assingment/StudentAssignmentDTO";

export interface IGetStudentAssignmentUseCase {
    execute(
        lessonId: string,
        userId: string
    ): Promise<StudentAssignmentDTO>;
}
