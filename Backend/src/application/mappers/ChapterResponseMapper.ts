import { Chapter } from "../../domain/entities/Chapter";
import { ChapterResponseDTO } from "../dtos/chapter/ChapterResponseDTO";

export class ChapterResponseMapper {
  static toDTO(chapter: Chapter): ChapterResponseDTO {
    if (!chapter.chapterId) {
      throw new Error("Cannot map a chapter without a chapter ID");
    }

    return {
      chapterId: chapter.chapterId,
      courseId: chapter.courseId,
      title: chapter.title,
      description: chapter.description,
      order: chapter.order,
      outcomes: chapter.outcomes,
      createdAt: chapter.createdAt.toISOString(),
      updatedAt: chapter.updatedAt.toISOString(),
    };
  }

  static toDTOList(chapters: Chapter[]): ChapterResponseDTO[] {
    return chapters.map((chapter) => this.toDTO(chapter));
  }
}
