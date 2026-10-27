
import {
    Enrollment,
    EnrollmentStatus,
} from "../../../domain/entities/Enrollment";

import { IEnrollmentRepository } from "../../../domain/repositories/courseRepositories/IEnrollmentRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { IEnrollInCourseUseCase } from "../../interfaces/enrollment/IEnrollInCourseUseCase";

import { CourseStatus } from "../../../shared/enums/CourseStatus";
import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class EnrollInCourseUseCase implements IEnrollInCourseUseCase {
    constructor(
        private readonly _enrollmentRepository: IEnrollmentRepository,
        private readonly _courseRepository: ICourseRepository
    ) {}

    async execute(
        userId: string,
        courseId: string
    ): Promise<Enrollment> {

        // 1. Validate IDs.
        const objectIdPattern = /^[a-f\d]{24}$/i;

        if (
            !objectIdPattern.test(userId) ||
            !objectIdPattern.test(courseId)
        ) {
            throw new AppError(
                "Invalid user ID or course ID",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 2. Find the course.
        const course = await this._courseRepository.findById(courseId);

        if (!course) {
            throw new AppError(
                "Course not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        // 3. Only published courses are available.
        if (course.status !== CourseStatus.PUBLISHED) {
            throw new AppError(
                "This course is not available for enrollment",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 4. Prevent teachers from enrolling in their own course.
        if (course.teacherId === userId) {
            throw new AppError(
                "You cannot enroll in your own course",
                HttpStatusCode.FORBIDDEN
            );
        }

        // 5. Check for an existing enrollment.
        const existingEnrollment =
            await this._enrollmentRepository.findByUserAndCourse(
                userId,
                courseId
            );

        if (existingEnrollment) {
            if (existingEnrollment.status === EnrollmentStatus.ACTIVE) {
                throw new AppError(
                    "You are already enrolled in this course",
                    HttpStatusCode.CONFLICT
                );
            }

            if (existingEnrollment.status === EnrollmentStatus.PENDING) {
                throw new AppError(
                    "An enrollment for this course is already pending",
                    HttpStatusCode.CONFLICT
                );
            }
        }

        // 6. Paid courses require verified payment.
        if (course.finalPrice > 0) {
            throw new AppError(
                "This course requires payment. Paid enrollment is not available yet.",
                HttpStatusCode.BAD_REQUEST
            );
        }

        const now = new Date();

        // 7. Reactivate a cancelled enrollment.
        if (existingEnrollment) {
            if (!existingEnrollment.enrollmentId) {
                throw new AppError(
                    "Invalid enrollment data",
                    HttpStatusCode.INTERNAL_SERVER_ERROR
                );
            }

            const reactivatedEnrollment =
                await this._enrollmentRepository.update(
                    existingEnrollment.enrollmentId,
                    {
                        status: EnrollmentStatus.ACTIVE,
                        enrolledAt: now,
                    }
                );

            if (!reactivatedEnrollment) {
                throw new AppError(
                    "Failed to reactivate enrollment",
                    HttpStatusCode.INTERNAL_SERVER_ERROR
                );
            }

            const countUpdated =
                await this._courseRepository.incrementTotalStudents(courseId);

            if (!countUpdated) {
                throw new AppError(
                    "Enrollment was reactivated, but the course count could not be updated",
                    HttpStatusCode.INTERNAL_SERVER_ERROR
                );
            }

            return reactivatedEnrollment;
        }

        // 8. Create a new active enrollment for a free course.
        const enrollment: Enrollment = {
            userId,
            courseId,
            status: EnrollmentStatus.ACTIVE,
            enrolledAt: now,
            createdAt: now,
            updatedAt: now,
        };

        try {
            const createdEnrollment =
                await this._enrollmentRepository.create(enrollment);

            const countUpdated =
                await this._courseRepository.incrementTotalStudents(courseId);

            if (!countUpdated) {
                throw new AppError(
                    "Enrollment was created, but the course count could not be updated",
                    HttpStatusCode.INTERNAL_SERVER_ERROR
                );
            }

            return createdEnrollment;
        } catch (error: unknown) {
            // Handle duplicate requests against the unique database index.
            if (
                typeof error === "object" &&
                error !== null &&
                "code" in error &&
                error.code === 11000
            ) {
                throw new AppError(
                    "You are already enrolled in this course",
                    HttpStatusCode.CONFLICT
                );
            }

            throw error;
        }
    }
}
