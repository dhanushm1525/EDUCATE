
import { IEnrollmentRepository } from "../../../domain/repositories/courseRepositories/IEnrollmentRepository";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";

import { IGetMyEnrolledCoursesUseCase } from "../../interfaces/enrollment/IGetMyEnrolledCoursesUseCase";
import { EnrolledCourseDTO } from "../../dtos/enrollment/EnrolledCourseDTO";
import { EnrolledCourseMapper } from "../../mappers/EnrolledCourseMapper";

import { EnrollmentStatus } from "../../../domain/entities/Enrollment";
import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class GetMyEnrolledCoursesUseCase
    implements IGetMyEnrolledCoursesUseCase {

    constructor(
        private readonly _enrollmentRepository: IEnrollmentRepository,
        private readonly _courseRepository: ICourseRepository
    ) {}

    async execute(userId: string): Promise<EnrolledCourseDTO[]> {

        // 1. Validate the user ID.
        if (!/^[a-f\d]{24}$/i.test(userId)) {
            throw new AppError(
                "Invalid user ID",
                HttpStatusCode.BAD_REQUEST
            );
        }

        // 2. Retrieve the user's enrollments.
        const enrollments =
            await this._enrollmentRepository.findByUserId(userId);

        // 3. Only active enrollments grant access.
        const activeEnrollments = enrollments.filter(
            enrollment => enrollment.status === EnrollmentStatus.ACTIVE
        );

        // 4. Fetch course details and map each result to a DTO.
        const results = await Promise.all(
            activeEnrollments.map(async enrollment => {

                if (!enrollment.enrollmentId) {
                    return null;
                }

                const course = await this._courseRepository.findById(
                    enrollment.courseId
                );

                if (!course) {
                    return null;
                }

                return EnrolledCourseMapper.toDTO(
                    enrollment,
                    course
                );
            })
        );

        // 5. Remove missing enrollment IDs and deleted courses.
        return results.filter(
            (item) => item !== null
        );
    }
}
