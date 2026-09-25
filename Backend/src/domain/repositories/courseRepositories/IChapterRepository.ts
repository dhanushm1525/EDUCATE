import { Chapter } from "../../entities/Chapter";

export interface IChapterRepository {
    create(chapter: Chapter): Promise<Chapter>;

    findById(chapterId: string): Promise<Chapter | null>;

    findByCourseId(courseId: string): Promise<Chapter[]>;

    update(
        chapterId: string,
        chapter: Partial<Chapter>
    ): Promise<Chapter | null>;

    delete(chapterId: string): Promise<boolean>;
}