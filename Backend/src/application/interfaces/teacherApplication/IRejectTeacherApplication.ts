import { TeacherApplication } from "../../../domain/entities/TeacherApplication";

export interface IRejectTeacherApplication {
    execute(
        applicationId: string,
        rejectionReason: string
    ): Promise<TeacherApplication>;
}