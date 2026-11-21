export interface ChapterResponseDTO {
  chapterId: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  outcomes?: string[];
  createdAt: string;
  updatedAt: string;
}
