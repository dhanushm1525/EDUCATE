import { ICreateTeacherApplication } 
    from "../../interfaces/teacherApplication/ICreateTeacherApplication";

import { ITeacherApplicationRepository } 
    from "../../../domain/repositories/userRepositories/ITeacherApplicationRepository";

import { IUserRepository } 
    from "../../../domain/repositories/userRepositories/IUserRepository";

import { CreateTeacherApplicationDTO } 
    from "../../dtos/TeacherApplication/CreateTeacherApplicationDTO";

import { TeacherApplication } 
    from "../../../domain/entities/TeacherApplication";

import { TeacherApplicationStatus } 
    from "../../../shared/enums/TeacherApplicationStatus";

import { AppError } 
    from "../../../shared/errors/AppError";


export class CreateTeacherApplication
    implements ICreateTeacherApplication {

    constructor(
        private readonly _teacherApplicationRepository:
            ITeacherApplicationRepository,

        private readonly _userRepository:
            IUserRepository
    ) {}

    async execute(
        userId: string,
        dto: CreateTeacherApplicationDTO
    ): Promise<TeacherApplication> {

        const user =
            await this._userRepository.findById(userId);

        if (!user) {
            throw new AppError("User not found", 404);
        }

        const applications =
            await this._teacherApplicationRepository
                .findByUserId(userId);

        const hasPendingApplication =
            applications.some(
                application =>
                    application.status ===
                    TeacherApplicationStatus.PENDING
            );

        if (hasPendingApplication) {
            throw new AppError(
                "You already have a pending teacher application",
                409
            );
        }

        const hasApprovedApplication =
            applications.some(
                application =>
                    application.status ===
                    TeacherApplicationStatus.APPROVED
            );

        if (hasApprovedApplication) {
            throw new AppError(
                "You are already a teacher",
                409
            );
        }

        const application: TeacherApplication = {

            userId,

            qualification: dto.qualification,

            experience: dto.experience,

            skills: dto.skills,

            bio: dto.bio,

            documents: dto.documents ?? [],

            certificates: dto.certificates ?? [],

            status: TeacherApplicationStatus.PENDING,

            createdAt: new Date(),

            updatedAt: new Date()
        };

        return await this._teacherApplicationRepository.create(
            application
        );
    }
}