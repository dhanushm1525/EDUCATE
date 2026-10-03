import { UpdateCourseDTO } from "../dtos/courses/UpdateCourseDTO";

export class CourseUpdateMapper {

    static toUpdateCourseDTO(body: UpdateCourseDTO): UpdateCourseDTO {
        return {
            categoryId: body.categoryId,
            title: body.title,
            subtitle: body.subtitle,
            description: body.description,
            thumbnail: body.thumbnail,
            trailer: body.trailer,
            language: body.language,
            level: body.level,
            duration: body.duration,
            price: body.price,
            discount: body.discount,
            tags: body.tags,
            objectives: body.objectives,
            requirements: body.requirements,
        };
    }

    static toEntityUpdate(dto: UpdateCourseDTO) {
        return {
            ...dto
        };
    }
}