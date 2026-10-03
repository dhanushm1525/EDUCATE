import { Course } from "../../domain/entities/Course";
import { CreateCourseDTO } from "../dtos/courses/CreateCourseDTO"
import { CourseStatus } from "../../shared/enums/CourseStatus";

export class CourseMapper {

    static toCreateCourseDTO(
        body: Omit<CreateCourseDTO, "teacherId">,
        teacherId: string
    ): CreateCourseDTO {

        return {
            teacherId,
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

    static toEntity(dto: CreateCourseDTO): Course {

        const finalPrice =
            dto.price - (dto.price * dto.discount) / 100;

        return {
            

            teacherId: dto.teacherId,
            categoryId: dto.categoryId,

            title: dto.title,
            subtitle: dto.subtitle,
            description: dto.description,

            thumbnail: dto.thumbnail,
            trailer: dto.trailer,

            language: dto.language,
            level: dto.level,

            duration: dto.duration,

            price: dto.price,
            discount: dto.discount,
            finalPrice,

            tags: dto.tags,

            objectives: dto.objectives,
            requirements: dto.requirements,

            featured: false,

            averageRating: 0,
            totalStudents: 0,

            status: CourseStatus.DRAFT,

            createdAt: new Date(),
            updatedAt: new Date()
        };
    }
}