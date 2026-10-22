
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";
import { IGetMyCoursesUseCase } from "../../interfaces/course/IGetMyCoursesUseCase";
import { Course } from "../../../domain/entities/Course";

export class GetMyCoursesUseCase implements IGetMyCoursesUseCase {

    constructor(
        private readonly _courseRepository: ICourseRepository
    ) {}

    async execute(teacherId: string): Promise<Course[]> {
        return this._courseRepository.findByTeacherId(teacherId);
    }
}
