import { Course } from "../../domain/entities/Course";
import { CourseResponseDTO } from "../dtos/courses/CourseResponseDTO";

export class CourseResponseMapper {
    static toDTO(course: Course): CourseResponseDTO {
        if (!course.courseId) {
            throw new Error(
                "Cannot map a course without a course ID"
            );
        }

        return {
            courseId: course.courseId,
            teacherId: course.teacherId,
            categoryId: course.categoryId,

            title: course.title,
            subtitle: course.subtitle,
            description: course.description,

            thumbnail: course.thumbnail,
            trailer: course.trailer,

            language: course.language,
            level: course.level,
            duration: course.duration,

            price: course.price,
            discount: course.discount,
            finalPrice: course.finalPrice,

            tags: course.tags,
            objectives: course.objectives,
            requirements: course.requirements,

            featured: course.featured ?? false,
            averageRating: course.averageRating ?? 0,
            totalStudents: course.totalStudents ?? 0,

            status: course.status,

            createdAt: course.createdAt.toISOString(),
            updatedAt: course.updatedAt.toISOString(),
        };
    }

    static toDTOList(courses: Course[]): CourseResponseDTO[] {
        return courses.map((course) => this.toDTO(course));
    }
}