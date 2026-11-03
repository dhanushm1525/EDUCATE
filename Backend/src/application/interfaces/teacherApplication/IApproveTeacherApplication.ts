import { TeacherApplication } from "../../../domain/entities/TeacherApplication";

export interface IApproveTeacherApplication {
    execute(applicationId: string): Promise<TeacherApplication>;
}