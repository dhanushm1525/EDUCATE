export interface LessonPreview {
  lessonId: string;
  title: string;
  description?: string;
  order: number;
  type: "video" | "reading";
  duration?: number;
  thumbnailUrl?: string;
}

export interface ChapterPreview {
  chapterId: string;
  title: string;
  description?: string;
  order: number;
  outcomes?: string[];
  lessons: LessonPreview[];
}

export interface CourseLearningContent {
  chapters: ChapterPreview[];
}

export interface CourseLearningContentApiResponse {
  success: boolean;
  message: string;
  data: CourseLearningContent;
}