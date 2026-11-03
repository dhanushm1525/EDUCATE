import { Request, Response, NextFunction } from "express";

import { IGetPendingTeacherApplications }
    from "../../../application/interfaces/teacherApplication/IGetPendingTeacherApplications";

import { HttpStatusCode }
    from "../../../shared/enums/HttpStatusCode";

import { successResponse }
    from "../../../shared/response/apiResponse";

export class GetPendingTeacherApplicationsController {

    constructor(
        private readonly _getPendingTeacherApplications:
            IGetPendingTeacherApplications
    ) {}

    async handle(
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {

        try {

            const result =
                await this._getPendingTeacherApplications.execute();

            successResponse(
                res,
                HttpStatusCode.OK,
                "Pending teacher applications retrieved successfully",
                result
            );

        } catch (error: unknown) {

            next(error);

        }
    }
}