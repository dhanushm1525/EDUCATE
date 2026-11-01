import { randomUUID } from "crypto";

import { ICourseThumbnailKeyPolicy } from "../../domain/policies/CourseThumbnailKeyPolicy";

export class S3CourseThumbnailKeyPolicy
    implements ICourseThumbnailKeyPolicy {

    private readonly _extensions: Record<string, string> = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
    };

    createKey(
        courseId: string,
        contentType: string
    ): string {

        const extension = this._extensions[contentType];

        if (!extension) {
            throw new Error(
                "Unsupported course thumbnail type"
            );
        }

        return `courses/${courseId}/thumbnail/${randomUUID()}${extension}`;
    }
}