import { Request, Response } from "express";

import { IUpdateAssignmentUseCase } from "../../../application/interfaces/assingment/IUpdateAssignmentUseCase";
import { AssignmentCreationMapper } from "../../../application/mappers/AssignmentCreationMapper";
import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class UpdateAssignmentController {

    constructor(
        private readonly _updateAssignmentUseCase:
            IUpdateAssignmentUseCase
    ) {}

    async handle(
        req: Request,
        res: Response
    ): Promise<Response> {

        const { assignmentId } = req.params;

        if(Array.isArray(assignmentId)){
            throw new AppError("invalid Assingment ID",HttpStatusCode.BAD_REQUEST)
        }

        const dto =
            AssignmentCreationMapper.toUpdateAssignmentDTO(
                req.body
            );

        const teacherId = req.user!.userId;

        const assignment =
            await this._updateAssignmentUseCase.execute(
                assignmentId,
                dto,
                teacherId
            );

        return res.status(200).json({
            success: true,
            message: "Assignment updated successfully",
            data: assignment,
        });
    }
}