import { EnrolledCourseDTO } from "../../dtos/enrollment/EnrolledCourseDTO";

export interface IGetMyEnrolledCoursesUseCase {
    execute(userId: string): Promise<EnrolledCourseDTO[]>;
}