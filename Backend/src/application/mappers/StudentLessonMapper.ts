import { Lesson } from "../../domain/entities/Lesson";
import { StudentLessonDTO } from "../dtos/lesson/StudentLessonDTO";

export class StudentLessonMapper {
  static toDTO(
    lesson: Lesson,
    media: Pick<StudentLessonDTO, "videoUrl" | "thumbnailUrl" | "attachments">,
  ): StudentLessonDTO {
    if (!lesson.lessonId) {
      throw new Error("Cannot map a lesson without a lesson ID");
    }

    return {
      lessonId: lesson.lessonId,
      chapterId: lesson.chapterId,
      title: lesson.title,
      description: lesson.description,
      order: lesson.order,
      type: lesson.type,
      duration: lesson.duration,
      videoUrl: media.videoUrl,
      thumbnailUrl: media.thumbnailUrl,
      attachments: media.attachments,
      content: lesson.content,
    };
  }
}
