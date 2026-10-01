import { ILessonMediaTypePolicy } from "../../domain/policies/LessonMediaPolicy";

export class LessonMediaTypePolicy
    implements ILessonMediaTypePolicy {

    private readonly _allowedTypes = new Set([
        "video/mp4",
        "video/webm",

        "application/pdf",

        "image/jpeg",
        "image/png",
        "image/webp",

        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]);

    supports(contentType: string): boolean {
        return this._allowedTypes.has(contentType);
    }
}