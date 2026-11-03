export type TeacherApplicationFileType =
    | "document"
    | "certificate";

export interface ITeacherApplicationDocumentPolicy {
    supports(contentType: string): boolean;

    createKey(
        userId: string,
        fileType: TeacherApplicationFileType,
        contentType: string
    ): string;
}