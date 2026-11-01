
import { Course } from "../../domain/entities/Course";
import { IStorageService } from "../interfaces/storage/IStorageService";
import { CourseResponseDTO } from "../dtos/courses/CourseResponseDTO";
import { CourseResponseMapper } from "../mappers/CourseResponseMapper";

export class CourseResponseService {
    constructor(
        private readonly _storageService: IStorageService
    ) { }

    async toDTO(course: Course): Promise<CourseResponseDTO> {
        const response = CourseResponseMapper.toDTO(course);

        if (course.thumbnail) {
            response.thumbnail =
                await this._storageService.generateDownloadUrl(
                    course.thumbnail
                );
        }

        return response;
    }

    async toDTOList(
        courses: Course[]
    ): Promise<CourseResponseDTO[]> {
        return Promise.all(
            courses.map((course) => this.toDTO(course))
        );
    }
}
