import { Course } from "../../domain/entities/Course"
import { CourseDocument } from "../database/models/CourseModel";

export class CoursePersistenceMapper {

    static toDomain(
        document: CourseDocument
    ): Course {

        return {
            courseId: document._id.toString(),

            teacherId: document.teacherId.toString(),
            categoryId: document.categoryId.toString(),

            title: document.title,
            subtitle: document.subtitle,
            description: document.description,

            thumbnail: document.thumbnail,
            trailer: document.trailer,

            language: document.language,
            level: document.level as Course["level"],

            duration: document.duration,

            price: document.price,
            discount: document.discount,
            finalPrice: document.finalPrice,

            tags: document.tags,

            objectives: document.objectives,
            requirements: document.requirements,

            featured: document.featured,

            averageRating: document.averageRating,
            totalStudents: document.totalStudents,

            status: document.status as Course["status"],
            rejectionReason: document.rejectionReason,

            createdAt: document.createdAt,
            updatedAt: document.updatedAt
        };
    }


    static toPersistence(
        course: Course
    ) {

        return {
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

            tags: course.tags ?? [],

            objectives: course.objectives ?? [],
            requirements: course.requirements ?? [],

            featured: course.featured ?? false,

            averageRating: course.averageRating ?? 0,
            totalStudents: course.totalStudents ?? 0,

            status: course.status,
            rejectionReason: course.rejectionReason
        };
    }


static toPersistenceUpdate(
    course: Partial<Course>
) {
    const {
        courseId: _courseId,
        createdAt: _createdAt,
        updatedAt: _updatedAt,
        ...updateData
    } = course;

    return updateData;
}
}