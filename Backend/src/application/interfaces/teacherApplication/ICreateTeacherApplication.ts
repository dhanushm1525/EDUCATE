import { CreateTeacherApplicationDTO } 
    from "../../dtos/TeacherApplication/CreateTeacherApplicationDTO";

import { TeacherApplication } 
    from "../../../domain/entities/TeacherApplication";

export interface ICreateTeacherApplication {

    execute(
        userId: string,
        dto: CreateTeacherApplicationDTO
    ): Promise<TeacherApplication>;

}