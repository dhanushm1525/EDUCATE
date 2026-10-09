export interface Chapter {
    chapterId: string;
    courseId: string;

    title: string;
    description?: string;

    order: number;

    outcomes?: string[];

    createdAt: string;
    updatedAt: string;
}

export interface CreateChapterRequest {
    title: string;
    description?: string;
    order: number;
    outcomes?: string[];
}

export type UpdateChapterRequest =
    Partial<CreateChapterRequest>;

export interface ChapterApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}