
import { Request, Response, NextFunction } from "express";
import { IGetMyCourseProgressUseCase } from "../../../application/interfaces/courseProgress/IGetMyCourseProgressUseCase";
import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class GetMyCourseProgressController {
    constructor(
        private readonly _useCase: IGetMyCourseProgressUseCase
    ) {}

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user) {
                throw new AppError("Unauthorized", HttpStatusCode.UNAUTHORIZED);
            }

            const progress = await this._useCase.execute(req.user.userId);

            res.status(HttpStatusCode.OK).json({
                success: true,
                message: "Course progress fetched successfully",
                data: progress,
            });
        } catch (error) {
            next(error);
        }
    }
}
