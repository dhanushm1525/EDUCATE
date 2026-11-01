import { ICourseThumbnailTypePolicy } from "../../domain/policies/CourseThumbnailTypePolicy";

export class CourseThumbnailTypePolicy
    implements ICourseThumbnailTypePolicy {

    private readonly _allowedTypes = new Set([
        "image/jpeg",
        "image/png",
        "image/webp",
    ]);

    supports(contentType: string): boolean {
        return this._allowedTypes.has(contentType);
    }
}