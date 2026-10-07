import { Request, Response } from "express";

import { IGetAssignmentUseCase } from "../../../application/interfaces/assingment/IGetAssignmentUseCase";
import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class GetAssignmentController {

    constructor(
        private readonly _getAssignmentUseCase: IGetAssignmentUseCase
    ) {}

    async handle(
        req: Request,
        res: Response
    ): Promise<Response> {

        const { lessonId } = req.params;

        if(Array.isArray(lessonId)){
            throw new AppError("Invalid lesson ID",HttpStatusCode.BAD_REQUEST)
        }

        const assignment =
            await this._getAssignmentUseCase.execute(
                lessonId
            );

        return res.status(200).json({
            success: true,
            message: "Assignment fetched successfully",
            data: assignment,
        });
    }
}