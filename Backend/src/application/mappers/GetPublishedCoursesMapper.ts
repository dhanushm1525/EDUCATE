import { GetPublishedCoursesDTO } from "../dtos/courses/GetPublishedCoursesDTO";
import { CourseSearchCriteria } from "../../domain/repositories/courseRepositories/CourseSearchCriteria";

export class GetPublishedCoursesMapper {
    static toSearchCriteria(
        dto: GetPublishedCoursesDTO
    ): CourseSearchCriteria {
        return {
            search: dto.search?.trim() || undefined,
            categoryId: dto.categoryId,
            level: dto.level,
            minPrice: dto.minPrice,
            maxPrice: dto.maxPrice,
        };
    }
}