import { CourseProgressDTO } from "../../dtos/courseProgress/CourseProgressDTO";

export interface IGetMyCourseProgressUseCase {
  execute(userId: string): Promise<CourseProgressDTO[]>;
}
