import { Lesson } from "../../domain/entities/Lesson";
import { CreateLessonDTO } from "../dtos/lesson/CreateLessonDTO";
import { UpdateLessonDTO } from "../dtos/lesson/UpdateLessonDTO";
import { GenerateLessonMediaUploadUrlDTO } from "../dtos/lesson/GenerateLessonMediaUploadUrlDTO";

type LessonRequestBody =
    Omit<CreateLessonDTO, "videoKey"> & {
        videoUrl?: string;
    };

type UpdateLessonRequestBody =
    Omit<UpdateLessonDTO, "videoKey"> & {
        videoUrl?: string;
    };

export class LessonCreationMapper {

    static toCreateLessonDTO(
        body: LessonRequestBody
    ): CreateLessonDTO {

        return {
            title: body.title,
            description: body.description,
            order: body.order,
            type: body.type,
            videoKey: body.videoUrl,
            content: body.content,
            attachments: body.attachments,
            duration: body.duration,
        };
    }

    static toUpdateLessonDTO(
        body: UpdateLessonRequestBody
    ): UpdateLessonDTO {

        return {
            title: body.title,
            description: body.description,
            order: body.order,
            type: body.type,
            videoKey: body.videoUrl,
            content: body.content,
            attachments: body.attachments,
            duration: body.duration,
        };
    }

    static toGenerateMediaUploadUrlDTO(
        body: GenerateLessonMediaUploadUrlDTO
    ): GenerateLessonMediaUploadUrlDTO {

        return {
            fileName: body.fileName,
            contentType: body.contentType,
        };
    }

    static toEntity(
        chapterId: string,
        dto: CreateLessonDTO
    ): Lesson {

        return {
            chapterId,
            title: dto.title,
            description: dto.description,
            order: dto.order,
            type: dto.type,
            videoKey: dto.videoKey,
            content: dto.content,
            attachments: dto.attachments,
            duration: dto.duration,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }
}