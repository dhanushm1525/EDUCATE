
import { StudentLessonDTO } from "../../dtos/lesson/StudentLessonDTO";

export interface IGetStudentLessonUseCase {
    execute(
        courseId: string,
        chapterId: string,
        lessonId: string,
        userId: string
    ): Promise<StudentLessonDTO>;
}
