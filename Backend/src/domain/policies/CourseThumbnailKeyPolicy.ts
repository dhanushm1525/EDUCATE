export interface ICourseThumbnailKeyPolicy {
    createKey(courseId: string, contentType: string): string;
}