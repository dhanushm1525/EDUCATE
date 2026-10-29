
import { ICourseRepository } from "../../../domain/repositories/courseRepositories/ICourseRepository";
import { IGetPendingCoursesUseCase } from "../../interfaces/course/IGetPendingCoursesUseCase";
import { GetPendingCoursesDTO } from "../../dtos/courses/GetPendingCoursesDTO";
import { GetPendingCoursesMapper } from "../../mappers/GetPendingCoursesMapper";

export class GetPendingCoursesUseCase implements IGetPendingCoursesUseCase {
    constructor(
        private readonly _courseRepository: ICourseRepository,
    ) {}

    async execute(): Promise<GetPendingCoursesDTO> {
        const courses = await this._courseRepository.findPending();

        return GetPendingCoursesMapper.toDTO(courses);
    }
}
