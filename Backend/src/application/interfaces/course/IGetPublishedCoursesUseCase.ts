import { Course } from "../../../domain/entities/Course";
import { GetPublishedCoursesDTO } from "../../dtos/courses/GetPublishedCoursesDTO";

export interface IGetPublishedCoursesUseCase {
    execute(dto: GetPublishedCoursesDTO): Promise<Course[]>;
}