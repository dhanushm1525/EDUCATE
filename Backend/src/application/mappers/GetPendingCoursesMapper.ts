
import { Course } from "../../domain/entities/Course";
import { GetPendingCoursesDTO } from "../dtos/courses/GetPendingCoursesDTO";

export class GetPendingCoursesMapper {
    static toDTO(courses: Course[]): GetPendingCoursesDTO {
        return { courses };
    }
}
