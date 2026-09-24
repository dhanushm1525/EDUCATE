import { Course } from "../../../domain/entities/Course";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { UpdateCourseDTO } from "../../dtos/courses/UpdateCourseDTO";
import { IUpdateCourseUseCase } from "../../interfaces/course/IUpdateCourseUseCase";
import { CourseUpdateMapper } from "../../mappers/CourseUpdateMapper";

import { AppError } from "../../../shared/errors/AppError";
import { CourseStatus } from "../../../shared/enums/CourseStatus";

export class UpdateCourseUseCase
    implements IUpdateCourseUseCase {

    constructor(
        private readonly courseRepository: ICourseRepository
    ) {}

    async execute(
        courseId: string,
        teacherId: string,
        dto: UpdateCourseDTO
    ): Promise<Course> {

        const course =
            await this.courseRepository.findById(courseId);

        if (!course) {
            throw new AppError(
                "Course not found",
                404
            );
        }

        if (course.teacherId !== teacherId) {
            throw new AppError(
                "You are not authorized to update this course",
                403
            );
        }

        if (
            course.status !== CourseStatus.DRAFT &&
            course.status !== CourseStatus.REJECTED
        ) {
            throw new AppError(
                "Only draft or rejected courses can be edited",
                400
            );
        }

        const updateData: Partial<Course> =
    CourseUpdateMapper.toEntityUpdate(dto);

        if (
            dto.price !== undefined ||
            dto.discount !== undefined
        ) {
            const price =
                dto.price ?? course.price;

            const discount =
                dto.discount ?? course.discount;

            updateData.price = price;
            updateData.discount = discount;

            updateData.finalPrice =
                price - (price * discount) / 100;
        }

        const updatedCourse =
            await this.courseRepository.update(
                courseId,
                updateData
            );

        if (!updatedCourse) {
            throw new AppError(
                "Course update failed",
                500
            );
        }

        return updatedCourse;
    }
}