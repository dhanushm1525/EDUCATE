export interface ICompleteLessonUseCase {
  execute(userId: string, courseId: string, lessonId: string): Promise<void>;
}
