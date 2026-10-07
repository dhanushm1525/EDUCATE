import { CreateAssignmentDTO } from "../dtos/assingment/CreateAssignmentDTO";

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
}