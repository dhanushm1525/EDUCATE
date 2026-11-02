
import { TeacherSubmissionDetailDTO } from "../../dtos/assingment/TeacherSubmissionDetailDTO";

export interface IGetTeacherSubmissionDetailUseCase {

    execute(
        assignmentId: string,
        submissionId: string,
        teacherId: string
    ): Promise<TeacherSubmissionDetailDTO>;
}
