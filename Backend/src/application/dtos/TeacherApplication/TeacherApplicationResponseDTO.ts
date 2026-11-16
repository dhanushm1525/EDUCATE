import { TeacherApplicationStatus } from "../../../shared/enums/TeacherApplicationStatus";

export interface TeacherApplicationResponseDTO {
    applicationId: string;
    userId: string;
    qualification: string;
    experience: number;
    skills: string[];
    bio: string;
    documents?: string[];
    certificates?: string[];
    status: TeacherApplicationStatus;
    rejectionReason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface TeacherApplicationActionResponseDTO {
    applicationId: string;
    userId: string;
    status: TeacherApplicationStatus;
    rejectionReason?: string;
}
