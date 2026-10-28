import { GetPublishedCoursesDTO } from "../dtos/courses/GetPublishedCoursesDTO";

export class GetPublishedCoursesQueryMapper {
    static toDTO(query: Record<string, unknown>): GetPublishedCoursesDTO {
        return {
            search:
                typeof query.search === "string"
                    ? query.search.trim() || undefined
                    : undefined,

            categoryId:
                typeof query.categoryId === "string"
                    ? query.categoryId
                    : undefined,

            level:
                typeof query.level === "string"
                    ? query.level
                    : undefined,

            minPrice:
                typeof query.minPrice === "string"
                    ? Number(query.minPrice)
                    : undefined,

            maxPrice:
                typeof query.maxPrice === "string"
                    ? Number(query.maxPrice)
                    : undefined,
        };
    }
}