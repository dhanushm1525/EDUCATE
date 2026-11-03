import { randomUUID } from "crypto";

import {
    ITeacherApplicationDocumentPolicy,
    TeacherApplicationFileType,
} from "../../domain/policies/TeacherApplicationDocumentPolicy";

export class S3TeacherApplicationDocumentPolicy
    implements ITeacherApplicationDocumentPolicy {

    private readonly _extensions: Record<string, string> = {
        "application/pdf": ".pdf",
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
        "application/msword": ".doc",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    };

    supports(contentType: string): boolean {
        return Object.prototype.hasOwnProperty.call(
            this._extensions,
            contentType
        );
    }

    createKey(
        userId: string,
        fileType: TeacherApplicationFileType,
        contentType: string
    ): string {

        const extension = this._extensions[contentType];

        if (!extension) {
            throw new Error("Unsupported teacher application file type");
        }

        return `users/${userId}/teacher-applications/${fileType}/${randomUUID()}${extension}`;
    }
}