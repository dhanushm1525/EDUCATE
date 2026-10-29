
import { GetPendingCoursesDTO } from "../../dtos/courses/GetPendingCoursesDTO";

export interface IGetPendingCoursesUseCase {
    execute(): Promise<GetPendingCoursesDTO>;
}
