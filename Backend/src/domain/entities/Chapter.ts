export interface Chapter {
    chapterId?: string;

    courseId: string;

    title: string;
    description?: string;

    order: number;
    outcomes?: string[];

    createdAt: Date;
    updatedAt: Date;
}