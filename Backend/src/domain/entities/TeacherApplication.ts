import { TeacherApplicationStatus } from "../../shared/enums/TeacherApplicationStatus";

export interface TeacherApplication {
    applicationId?: string;

    userId: string;

    qualification: string;

    experience: number;

    skills: string[];

    bio: string;

    documents?: string[];

    certificates?: string[];

    status: TeacherApplicationStatus;

    rejectionReason?: string;

    createdAt: Date;

    updatedAt: Date;
}