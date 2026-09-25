export interface IProfileImagePolicy {
    createKey(userId: string): string;
    isOwnedByUser(key: string, userId: string): boolean;
    isManagedImage(value: string): boolean;
}
