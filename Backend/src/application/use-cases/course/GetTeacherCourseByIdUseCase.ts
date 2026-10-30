import { Course } from "../../../domain/entities/Course";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";
import { IGetTeacherCourseByIdUseCase } from "../../interfaces/course/IGetTeacherCourseByIdUseCase";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class GetTeacherCourseByIdUseCase
    implements IGetTeacherCourseByIdUseCase {

    constructor(
        private readonly _courseRepository: ICourseRepository
    ) {}

    async execute(
        courseId: string,
        teacherId: string
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
                "You are not authorized to access this course",
                HttpStatusCode.FORBIDDEN
            );
        }

        return course;
    }
}