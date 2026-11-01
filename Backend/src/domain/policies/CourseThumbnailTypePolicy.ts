export interface ICourseThumbnailTypePolicy {
    supports(contentType: string): boolean;
}