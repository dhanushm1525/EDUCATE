import { IRejectTeacherApplication } from "../../interfaces/teacherApplication/IRejectTeacherApplication";
import { ITeacherApplicationRepository } from "../../../domain/repositories/userRepositories/ITeacherApplicationRepository";

import { TeacherApplication } from "../../../domain/entities/TeacherApplication";
import { TeacherApplicationStatus } from "../../../shared/enums/TeacherApplicationStatus";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class RejectTeacherApplication implements IRejectTeacherApplication {
    constructor(
        private readonly _teacherApplicationRepository: ITeacherApplicationRepository
    ) {}

    async execute(
        applicationId: string,
        rejectionReason: string
    ): Promise<TeacherApplication> {
        const reason = rejectionReason?.trim();

        if (!reason) {
            throw new AppError(
                "Rejection reason is required",
                HttpStatusCode.BAD_REQUEST
            );
        }

        const application =
            await this._teacherApplicationRepository.findById(applicationId);

        if (!application) {
            throw new AppError(
                "Teacher application not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        if (application.status !== TeacherApplicationStatus.PENDING) {
            throw new AppError(
                "Only pending applications can be rejected",
                HttpStatusCode.CONFLICT
            );
        }

        const updatedApplication =
            await this._teacherApplicationRepository.update(
                applicationId,
                {
                    status: TeacherApplicationStatus.REJECTED,
                    rejectionReason: reason,
                    updatedAt: new Date()
                }
            );

        if (!updatedApplication) {
            throw new AppError(
                "Failed to reject teacher application",
                HttpStatusCode.INTERNAL_SERVER_ERROR
            );
        }

        return updatedApplication;
    }
}