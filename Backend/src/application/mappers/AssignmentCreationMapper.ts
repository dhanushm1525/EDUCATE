import { CreateAssignmentDTO } from "../dtos/assingment/CreateAssignmentDTO";
import { UpdateAssignmentDTO } from "../dtos/assingment/UpdateAssignmentDTO";
export class AssignmentCreationMapper {

    static toCreateAssignmentDTO(
        body: CreateAssignmentDTO
    ): CreateAssignmentDTO {

        return {
            lessonId: body.lessonId,
            title: body.title,
            description: body.description,
            questions: body.questions,
            passingMarks: body.passingMarks,
            timeLimit: body.timeLimit,
            attemptsAllowed: body.attemptsAllowed,
        };
    }


    static toUpdateAssignmentDTO(
    body: UpdateAssignmentDTO
): UpdateAssignmentDTO {

    return {
        title: body.title,
        description: body.description,
        questions: body.questions,
        passingMarks: body.passingMarks,
        timeLimit: body.timeLimit,
        attemptsAllowed: body.attemptsAllowed,
    };
}
}