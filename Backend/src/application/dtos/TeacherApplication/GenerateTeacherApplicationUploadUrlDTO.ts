import { TeacherApplicationFileType } from "../../../domain/policies/TeacherApplicationDocumentPolicy";

export interface GenerateTeacherApplicationUploadUrlDTO {
    userId: string;
    fileType: TeacherApplicationFileType;
    contentType: string;
}