import { TeacherApplication } from "../../domain/entities/TeacherApplication";
import {
  TeacherApplicationActionResponseDTO,
  TeacherApplicationResponseDTO,
} from "../dtos/TeacherApplication/TeacherApplicationResponseDTO";

export class TeacherApplicationResponseMapper {
  static toDTO(application: TeacherApplication): TeacherApplicationResponseDTO {
    if (!application.applicationId) {
      throw new Error("Cannot map a teacher application without an application ID");
    }

    return {
      applicationId: application.applicationId,
      userId: application.userId,
      qualification: application.qualification,
      experience: application.experience,
      skills: application.skills,
      bio: application.bio,
      documents: application.documents,
      certificates: application.certificates,
      status: application.status,
      rejectionReason: application.rejectionReason,
      createdAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
    };
  }

  static toActionDTO(application: TeacherApplication): TeacherApplicationActionResponseDTO {
    if (!application.applicationId) {
      throw new Error("Cannot map a teacher application without an application ID");
    }

    return {
      applicationId: application.applicationId,
      userId: application.userId,
      status: application.status,
      rejectionReason: application.rejectionReason,
    };
  }
}
