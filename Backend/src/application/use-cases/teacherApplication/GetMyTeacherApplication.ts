import { IGetMyTeacherApplication } from "../../interfaces/teacherApplication/IGetMyTeacherApplication";

import { ITeacherApplicationRepository } from "../../../domain/repositories/userRepositories/ITeacherApplicationRepository";

import { TeacherApplication } from "../../../domain/entities/TeacherApplication";

export class GetMyTeacherApplication
    implements IGetMyTeacherApplication {

    constructor(
        private readonly _teacherApplicationRepository:
            ITeacherApplicationRepository
    ) {}

    async execute(
        userId: string
    ): Promise<TeacherApplication | null> {

        const applications =
            await this._teacherApplicationRepository.findByUserId(userId);

        if (applications.length === 0) {
            return null;
        }

        const latestApplication = applications.reduce(
            (latest, current) =>
                current.createdAt.getTime() > latest.createdAt.getTime()
                    ? current
                    : latest
        );

        return latestApplication;
    }
}