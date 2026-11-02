
import { TeacherAssignmentSubmissionDTO } from "../../dtos/assingment/TeacherAssignmentSubmissionDTO";

export interface IGetTeacherAssignmentSubmissionsUseCase {

    execute(
        assignmentId: string,
        teacherId: string
    ): Promise<TeacherAssignmentSubmissionDTO[]>;
}
