import { CreateTeacherApplicationDTO } from "../dtos/TeacherApplication/CreateTeacherApplicationDTO";

export class TeacherApplicationCreationMapper {

    static toCreateTeacherApplicationDTO(
        body: CreateTeacherApplicationDTO
    ): CreateTeacherApplicationDTO {
        return {
            qualification: body.qualification,
            experience: body.experience,
            skills: body.skills,
            bio: body.bio,
            documents: body.documents,
            certificates: body.certificates,
        };
    }
}
