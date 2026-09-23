import { Course } from "../../../domain/entities/Course";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";
import { CreateCourseDTO } from "../../dtos/courses/CreateCourseDTO";
import { ICreateCourseUseCase } from "../../interfaces/course/ICreateCourseUseCase";
import { CourseMapper } from "../../mappers/CourseCreationMapper";

export class CreateCourseUseCase implements ICreateCourseUseCase{

    constructor(
        private readonly _courseRepository:ICourseRepository
    ) {}

    async execute(dto: CreateCourseDTO): Promise<Course> {

        const course = CourseMapper.toEntity(dto);

        return await this._courseRepository.create(course);
    }
}