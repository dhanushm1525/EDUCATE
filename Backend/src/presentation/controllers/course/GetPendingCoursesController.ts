
import { Request, Response, NextFunction } from "express";
import { IGetPendingCoursesUseCase } from "../../../application/interfaces/course/IGetPendingCoursesUseCase";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { CourseResponseMapper } from "../../../application/mappers/CourseResponseMapper";

export class GetPendingCoursesController {
    constructor(
        private readonly _getPendingCoursesUseCase: IGetPendingCoursesUseCase,
    ) {}

    async handle(
        _req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const result = await this._getPendingCoursesUseCase.execute();

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Pending courses retrieved successfully",
                data: CourseResponseMapper.toDTOList(result.courses),
            });
        } catch (error: unknown) {
            next(error);
        }
    }
}
