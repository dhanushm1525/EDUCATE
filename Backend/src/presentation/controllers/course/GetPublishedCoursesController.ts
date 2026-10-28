import { Request, Response, NextFunction } from "express";

import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";
import { IGetPublishedCoursesUseCase } from "../../../application/interfaces/course/IGetPublishedCoursesUseCase";
import { GetPublishedCoursesQueryMapper } from "../../../application/mappers/GetPublishedCoursesQueryMapper";
import { CourseResponseMapper } from "../../../application/mappers/CourseResponseMapper";

export class GetPublishedCoursesController {
    constructor(
        private readonly _getPublishedCoursesUseCase: IGetPublishedCoursesUseCase
    ) {}

    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const dto = GetPublishedCoursesQueryMapper.toDTO(
                req.query as Record<string, unknown>
            );

            const courses =
                await this._getPublishedCoursesUseCase.execute(dto);

            const responseData =
                CourseResponseMapper.toDTOList(courses);

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Published courses fetched successfully",
                data: responseData,
            });
        } catch (error) {
            next(error);
        }
    }
}