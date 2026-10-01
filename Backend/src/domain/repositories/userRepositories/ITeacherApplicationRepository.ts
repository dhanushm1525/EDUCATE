import { TeacherApplication } from "../../entities/TeacherApplication";
import { TeacherApplicationStatus } from "../../../shared/enums/TeacherApplicationStatus";

export interface ITeacherApplicationRepository {
    create(application: TeacherApplication): Promise<TeacherApplication>;

    findById(applicationId: string): Promise<TeacherApplication | null>;

    findByUserId(userId: string): Promise<TeacherApplication[]>;

    findByStatus(
        status: TeacherApplicationStatus
    ): Promise<TeacherApplication[]>;

    update(
        applicationId: string,
        application: Partial<TeacherApplication>
    ): Promise<TeacherApplication | null>;
}