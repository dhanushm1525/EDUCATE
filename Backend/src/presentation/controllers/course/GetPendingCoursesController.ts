
import { Request, Response, NextFunction } from "express";

import { IGetPendingCoursesUseCase } from "../../../application/interfaces/course/IGetPendingCoursesUseCase";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { CourseResponseService } from "../../../application/services/CourseResponseService";

export class GetPendingCoursesController {
    constructor(
        private readonly _getPendingCoursesUseCase: IGetPendingCoursesUseCase,
        private readonly _courseResponseService: CourseResponseService
    ) {}

    async handle(
        _req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const result = await this._getPendingCoursesUseCase.execute();

            const responseData =
                await this._courseResponseService.toDTOList(result.courses);

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Pending courses retrieved successfully",
                data: responseData,
            });
        } catch (error: unknown) {
            next(error);
        }
    }
}
