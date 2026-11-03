import { TeacherApplicationStatus } from "../../../shared/enums/TeacherApplicationStatus";

export interface TeacherApplicationReviewDTO {
    applicationId: string;
    userId: string;
    qualification: string;
    experience: number;
    skills: string[];
    bio: string;
    documents: string[];
    certificates: string[];
    status: TeacherApplicationStatus;
    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;

    applicant: {
        firstName: string;
        lastName: string;
        email: string;
        avatar?: string;
    };
}