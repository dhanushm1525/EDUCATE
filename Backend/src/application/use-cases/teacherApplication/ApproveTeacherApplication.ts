import { IApproveTeacherApplication } from "../../interfaces/teacherApplication/IApproveTeacherApplication";
import { ITeacherApplicationRepository } from "../../../domain/repositories/userRepositories/ITeacherApplicationRepository";
import { IUserRepository } from "../../../domain/repositories/userRepositories/IUserRepository";

import { TeacherApplication } from "../../../domain/entities/TeacherApplication";
import { TeacherApplicationStatus } from "../../../shared/enums/TeacherApplicationStatus";
import { UserRole } from "../../../shared/enums/UserRole";

import { AppError } from "../../../shared/errors/AppError";
import { HttpStatusCode } from "../../../shared/enums/HttpStatusCode";

export class ApproveTeacherApplication implements IApproveTeacherApplication {
    constructor(
        private readonly _teacherApplicationRepository: ITeacherApplicationRepository,
        private readonly _userRepository: IUserRepository
    ) {}

    async execute(applicationId: string): Promise<TeacherApplication> {
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
                "Only pending applications can be approved",
                HttpStatusCode.CONFLICT
            );
        }

        const user = await this._userRepository.findById(application.userId);

        if (!user) {
            throw new AppError(
                "Applicant user not found",
                HttpStatusCode.NOT_FOUND
            );
        }

        if (user.role !== UserRole.STUDENT) {
            throw new AppError(
                "Only student accounts can be promoted to teacher",
                HttpStatusCode.CONFLICT
            );
        }

        // Promote the applicant to teacher.
        user.changeRole(UserRole.TEACHER);
        await this._userRepository.update(user);

        // Update the application status.
        try {
            const updatedApplication =
                await this._teacherApplicationRepository.update(
                    applicationId,
                    {
                        status: TeacherApplicationStatus.APPROVED,
                        rejectionReason: undefined,
                        updatedAt: new Date()
                    }
                );

            if (!updatedApplication) {
                throw new AppError(
                    "Failed to approve teacher application",
                    HttpStatusCode.INTERNAL_SERVER_ERROR
                );
            }

            return updatedApplication;
        } catch (error) {
            // Roll back the role change if application approval fails.
            user.changeRole(UserRole.STUDENT);
            await this._userRepository.update(user);

            throw error;
        }
    }
}