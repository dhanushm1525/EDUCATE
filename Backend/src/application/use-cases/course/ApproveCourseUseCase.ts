
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";
import { Course } from "../../../domain/entities/Course";
import { CourseStatus } from "../../../shared/enums/CourseStatus";
import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { ApproveCourseDTO } from "../../dtos/courses/ApproveCourseDTO";
import { IApproveCourseUseCase } from "../../interfaces/course/IApproveCourseUseCase";

export class ApproveCourseUseCase implements IApproveCourseUseCase {
    constructor(
        private readonly _courseRepository: ICourseRepository,
    ) {}

    async execute(dto: ApproveCourseDTO): Promise<Course> {
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
                "Only pending courses can be approved",
                HttpStatusCode.BAD_REQUEST,
            );
        }

        const approvedCourse = await this._courseRepository.update(
            dto.courseId,
            {
                status: CourseStatus.PUBLISHED,
                rejectionReason: undefined,
            },
        );

        if (!approvedCourse) {
            throw new AppError(
                "Failed to approve course",
                HttpStatusCode.INTERNAL_SERVER_ERROR,
            );
        }

        return approvedCourse;
    }
}
