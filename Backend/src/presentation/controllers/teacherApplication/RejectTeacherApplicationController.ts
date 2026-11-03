import { Request, Response, NextFunction } from "express";

import { IRejectTeacherApplication }
    from "../../../application/interfaces/teacherApplication/IRejectTeacherApplication";

import { HttpStatusCode }
    from "../../../shared/enums/HttpStatusCode";

import { AppError }
    from "../../../shared/errors/AppError";

import { successResponse }
    from "../../../shared/response/apiResponse";

export class RejectTeacherApplicationController {

    constructor(
        private readonly _rejectTeacherApplication:
            IRejectTeacherApplication
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

            const rejectionReason = req.body.rejectionReason;

            const result =
                await this._rejectTeacherApplication.execute(
                    applicationId,
                    rejectionReason
                );

            successResponse(
                res,
                HttpStatusCode.OK,
                "Teacher application rejected successfully",
                {
                    applicationId: result.applicationId,
                    userId: result.userId,
                    status: result.status,
                    rejectionReason: result.rejectionReason
                }
            );

        } catch (error: unknown) {
            next(error);
        }
    }
}