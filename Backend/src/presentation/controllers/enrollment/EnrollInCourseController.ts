
import { Request, Response, NextFunction } from "express";

import { IEnrollInCourseUseCase } from "../../../application/interfaces/enrollment/IEnrollInCourseUseCase";

import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { AppError } from "../../../shared/errors/AppError";

export class EnrollInCourseController {
    constructor(
        private readonly _enrollInCourseUseCase: IEnrollInCourseUseCase
    ) { }

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            if (!req.user) {
                throw new AppError(
                    "Unauthorized",
                    HttpStatusCode.UNAUTHORIZED
                );
            }

            const courseId = req.params.courseId;

            if (typeof courseId !== "string" || !courseId.trim()) {
                throw new AppError(
                    "A valid course ID is required",
                    HttpStatusCode.BAD_REQUEST
                );
            }

            const enrollment = await this._enrollInCourseUseCase.execute(
                req.user.userId,
                courseId
            );

            res.status(HttpStatusCode.CREATED).json({
                success: true,
                message: "Enrolled in course successfully",
                data: enrollment,
            });
        } catch (error) {
            next(error);
        }
    }
}
