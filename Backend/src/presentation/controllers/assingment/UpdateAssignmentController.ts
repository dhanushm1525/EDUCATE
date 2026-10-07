import { Request, Response } from "express";

import { IUpdateAssignmentUseCase } from "../../../application/interfaces/assingment/IUpdateAssignmentUseCase";
import { AssignmentCreationMapper } from "../../../application/mappers/AssignmentCreationMapper";

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