import { Request, Response } from "express";

import { IDeleteAssignmentUseCase } from "../../../application/interfaces/assingment/IDeleteAssignmentUseCase";
import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class DeleteAssignmentController {

    constructor(
        private readonly _deleteAssignmentUseCase:
            IDeleteAssignmentUseCase
    ) {}

    async handle(
        req: Request,
        res: Response
    ): Promise<Response> {

        const { assignmentId } = req.params;


        if(Array.isArray(assignmentId)){
            throw new AppError("invalid Assingment ID",HttpStatusCode.BAD_REQUEST)
        }

        const teacherId = req.user!.userId;

        await this._deleteAssignmentUseCase.execute(
            assignmentId,
            teacherId
        );

        return res.status(200).json({
            success: true,
            message: "Assignment deleted successfully",
        });
    }
}