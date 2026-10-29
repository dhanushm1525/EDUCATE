
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";
import { Course } from "../../../domain/entities/Course";
import { CourseStatus } from "../../../shared/enums/CourseStatus";
import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { RejectCourseDTO } from "../../dtos/courses/RejectCourseDTO";
import { IRejectCourseUseCase } from "../../interfaces/course/IRejectCourseUseCase";

export class RejectCourseUseCase implements IRejectCourseUseCase {
    constructor(
        private readonly _courseRepository: ICourseRepository,
    ) {}

    async execute(dto: RejectCourseDTO): Promise<Course> {
        const rejectionReason = dto.rejectionReason.trim();

        if (!rejectionReason) {
            throw new AppError(
                "A rejection reason is required",
                HttpStatusCode.BAD_REQUEST,
            );
        }

        const course = await this._courseRepository.findById(
            dto.courseId,
        );

        if (!course) {
            throw new AppError(
                "Course not found",
                HttpStatusCode.NOT_FOUND,
            );
        }

        if (course.status !== CourseStatus.PENDING) {
            throw new AppError(
                "Only pending courses can be rejected",
                HttpStatusCode.BAD_REQUEST,
            );
        }

        const rejectedCourse = await this._courseRepository.update(
            dto.courseId,
            {
                status: CourseStatus.REJECTED,
                rejectionReason,
            },
        );

        if (!rejectedCourse) {
            throw new AppError(
                "Failed to reject course",
                HttpStatusCode.INTERNAL_SERVER_ERROR,
            );
        }

        return rejectedCourse;
    }
}
