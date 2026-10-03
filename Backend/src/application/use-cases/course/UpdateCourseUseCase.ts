import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

import { Course } from "../../../domain/entities/Course";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { UpdateCourseDTO } from "../../dtos/courses/UpdateCourseDTO";
import { IUpdateCourseUseCase } from "../../interfaces/course/IUpdateCourseUseCase";
import { CourseUpdateMapper } from "../../mappers/CourseUpdateMapper";

import { AppError } from "../../../shared/errors/AppError";
import { ICourseStatusPolicy } from "../../../domain/policies/CourseStatusPolicy";

export class UpdateCourseUseCase
    implements IUpdateCourseUseCase {

    constructor(
        private readonly _courseRepository: ICourseRepository,
        private readonly _courseStatusPolicy: ICourseStatusPolicy
    ) {}

    async execute(
        courseId: string,
        teacherId: string,
        dto: UpdateCourseDTO
    ): Promise<Course> {

        const course =
            await this._courseRepository.findById(courseId);

        if (!course) {
            throw new AppError(
                "Course not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        if (course.teacherId !== teacherId) {
            throw new AppError(
                "You are not authorized to update this course",
                HttpStatusCode.FORBIDDEN
            );
        }

        if (!this._courseStatusPolicy.canEdit(course.status)) {
            throw new AppError(
                "Only draft or rejected courses can be edited",
                HttpStatusCode.BAD_REQUEST
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
            await this._courseRepository.update(
                courseId,
                updateData
            );

        if (!updatedCourse) {
            throw new AppError(
                "Course update failed",
                HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }

        return updatedCourse;
    }
}