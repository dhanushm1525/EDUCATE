import { GenerateLessonMediaUploadUrlDTO } from "../../dtos/lesson/GenerateLessonMediaUploadUrlDTO,";
import { GenerateLessonMediaUploadUrlResponseDTO } from "../../dtos/lesson/GenerateLessonMediaUploadUrlResponseDTO";

export interface IGenerateLessonMediaUploadUrlUseCase {
    execute(
        courseId: string,
        chapterId: string,
        lessonId: string,
        teacherId: string,
        dto: GenerateLessonMediaUploadUrlDTO
    ): Promise<GenerateLessonMediaUploadUrlResponseDTO>;
}