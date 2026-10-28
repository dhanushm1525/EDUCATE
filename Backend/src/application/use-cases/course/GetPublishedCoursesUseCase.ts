import { Course } from "../../../domain/entities/Course";
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";
import { GetPublishedCoursesDTO } from "../../dtos/courses/GetPublishedCoursesDTO";
import { GetPublishedCoursesMapper } from "../../mappers/GetPublishedCoursesMapper";
import { IGetPublishedCoursesUseCase } from "../../interfaces/course/IGetPublishedCoursesUseCase";

export class GetPublishedCoursesUseCase
    implements IGetPublishedCoursesUseCase {

    constructor(
        private readonly _courseRepository: ICourseRepository
    ) {}

    async execute(
        dto: GetPublishedCoursesDTO
    ): Promise<Course[]> {
        const criteria =
            GetPublishedCoursesMapper.toSearchCriteria(dto);

        return this._courseRepository.findPublished(criteria);
    }
}