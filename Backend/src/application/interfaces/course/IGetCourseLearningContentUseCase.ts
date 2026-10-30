import { CourseLearningContentDTO } from "../../dtos/courses/CourseLearningContentDTO";

export interface IGetCourseLearningContentUseCase {
    execute(courseId: string): Promise<CourseLearningContentDTO>;
}