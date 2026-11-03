import { IGetPendingTeacherApplications } from "../../interfaces/teacherApplication/IGetPendingTeacherApplications";

import { ITeacherApplicationRepository } from "../../../domain/repositories/userRepositories/ITeacherApplicationRepository";
import { IUserRepository } from "../../../domain/repositories/userRepositories/IUserRepository";

import { TeacherApplicationReviewDTO } from "../../dtos/TeacherApplication/TeacherApplicationReviewDTO";
import { TeacherApplicationStatus } from "../../../shared/enums/TeacherApplicationStatus";

import { TeacherApplicationReviewMapper } from "../../mappers/TeacherApplicationReviewMapper";

export class GetPendingTeacherApplications
    implements IGetPendingTeacherApplications {

    constructor(
        private readonly _teacherApplicationRepository: ITeacherApplicationRepository,
        private readonly _userRepository: IUserRepository
    ) {}

    async execute(): Promise<TeacherApplicationReviewDTO[]> {

        const applications =
            await this._teacherApplicationRepository.findByStatus(
                TeacherApplicationStatus.PENDING
            );

        if (applications.length === 0) {
            return [];
        }

        const userIds = [
            ...new Set(applications.map(application => application.userId))
        ];

        const users = await this._userRepository.findByIds(userIds);

        const userMap = new Map(
            users.map(user => [user.id!, user])
        );

        return applications.flatMap(application => {

            const applicant = userMap.get(application.userId);

            if (!applicant) {
                return [];
            }

            return [
                TeacherApplicationReviewMapper.toDTO(
                    application,
                    applicant
                )
            ];
        });
    }
}