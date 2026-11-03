import { TeacherApplication } from "../../domain/entities/TeacherApplication";
import { User } from "../../domain/entities/User";

import { TeacherApplicationReviewDTO } from "../dtos/TeacherApplication/TeacherApplicationReviewDTO";

export class TeacherApplicationReviewMapper {
    static toDTO(
        application: TeacherApplication,
        applicant: User
    ): TeacherApplicationReviewDTO {
        return {
            applicationId: application.applicationId!,
            userId: application.userId,
            qualification: application.qualification,
            experience: application.experience,
            skills: application.skills,
            bio: application.bio,
            documents: application.documents ?? [],
            certificates: application.certificates ?? [],
            status: application.status,
            rejectionReason: application.rejectionReason,
            createdAt: application.createdAt,
            updatedAt: application.updatedAt,

            applicant: {
                firstName: applicant.firstName,
                lastName: applicant.lastName,
                email: applicant.email,
                avatar: applicant.avatar
            }
        };
    }
}