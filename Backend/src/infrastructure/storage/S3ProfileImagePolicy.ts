import { randomUUID } from "crypto";
import { IProfileImagePolicy } from "../../application/interfaces/user/IProfileImagePolicy";

export class S3ProfileImagePolicy implements IProfileImagePolicy {
    private prefixFor(userId: string): string {
        return `users/${userId}/profile/`;
    }

    createKey(userId: string): string {
        return `${this.prefixFor(userId)}${randomUUID()}`;
    }

    isOwnedByUser(key: string, userId: string): boolean {
        return key.startsWith(this.prefixFor(userId));
    }

    isManagedImage(value: string): boolean {
        return value.startsWith("users/");
    }
}
