import { Request, Response, NextFunction } from "express";

import { IApproveTeacherApplication }
    from "../../../application/interfaces/teacherApplication/IApproveTeacherApplication";

import { HttpStatusCode }
    from "../../../shared/enums/HttpStatusCode";

import { AppError }
    from "../../../shared/errors/AppError";

import { successResponse }
    from "../../../shared/response/apiResponse";

export class ApproveTeacherApplicationController {

    constructor(
        private readonly _approveTeacherApplication:
            IApproveTeacherApplication
    ) {}

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const applicationId = req.params.applicationId;

            if (
                typeof applicationId !== "string" ||
                !applicationId.trim()
            ) {
                throw new AppError(
                    "A valid application ID is required",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            const result =
                await this._approveTeacherApplication.execute(
                    applicationId
                );

            successResponse(
                res,
                HttpStatusCode.OK,
                "Teacher application approved successfully",
                {
                    applicationId: result.applicationId,
                    userId: result.userId,
                    status: result.status
                }
            );

        } catch (error: unknown) {
            next(error);
        }
    }
}