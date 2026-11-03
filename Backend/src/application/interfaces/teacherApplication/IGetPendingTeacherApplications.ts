import { TeacherApplicationReviewDTO } from "../../dtos/TeacherApplication/TeacherApplicationReviewDTO";

export interface IGetPendingTeacherApplications {
    execute(): Promise<TeacherApplicationReviewDTO[]>;
}