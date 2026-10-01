import { IImageTypePolicy } from "../../application/interfaces/user/IImageTypePolicy";

export class ProfileImageTypePolicy implements IImageTypePolicy {
    private readonly _allowedTypes = new Set([
        "image/jpeg",
        "image/png",
        "image/webp",
    ]);

    supports(contentType: string): boolean {
        return this._allowedTypes.has(contentType);
    }
}
