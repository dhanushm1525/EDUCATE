import { Course } from "../../../domain/entities/Course";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";
import { IGetPublishedCourseByIdUseCase } from "../../interfaces/course/IGetPublishedCourseByIdUseCase";

export class GetPublishedCourseByIdUseCase
    implements IGetPublishedCourseByIdUseCase {

    constructor(
        private readonly _courseRepository: ICourseRepository
    ) {}

    async execute(courseId: string): Promise<Course | null> {
        return this._courseRepository.findPublishedById(courseId);
    }
}