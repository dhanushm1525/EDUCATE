import { TeacherApplication } from "../../../domain/entities/TeacherApplication";

export interface IGetMyTeacherApplication {
    execute(userId: string): Promise<TeacherApplication | null>;
}