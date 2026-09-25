import { IImageTypePolicy } from "../../application/interfaces/user/IImageTypePolicy";

export class ProfileImageTypePolicy implements IImageTypePolicy {
    private readonly allowedTypes = new Set([
        "image/jpeg",
        "image/png",
        "image/webp",
    ]);

    supports(contentType: string): boolean {
        return this.allowedTypes.has(contentType);
    }
}
