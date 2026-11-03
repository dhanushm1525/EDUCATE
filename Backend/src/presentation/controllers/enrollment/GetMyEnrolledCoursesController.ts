
import { Request, Response, NextFunction } from "express";

import { IGetMyEnrolledCoursesUseCase } from "../../../application/interfaces/enrollment/IGetMyEnrolledCoursesUseCase";
import { CourseResponseService } from "../../../application/services/CourseResponseService";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class GetMyEnrolledCoursesController {
    constructor(
        private readonly _getMyEnrolledCoursesUseCase: IGetMyEnrolledCoursesUseCase,
        private readonly _courseResponseService: CourseResponseService
    ) {}

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

            const enrolledCourses =
                await this._getMyEnrolledCoursesUseCase.execute(
                    req.user.userId
                );

            const responseData = await Promise.all(
                enrolledCourses.map(async (enrollment) => ({
                    enrollmentId: enrollment.enrollmentId,
                    enrolledAt: enrollment.enrolledAt,
                    course: await this._courseResponseService.toDTO(
                        enrollment.course
                    ),
                }))
            );

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Enrolled courses fetched successfully",
                data: responseData,
            });
        } catch (error) {
            next(error);
        }
    }
}
