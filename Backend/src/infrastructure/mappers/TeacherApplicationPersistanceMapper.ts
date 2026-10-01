import { TeacherApplication } from "../../domain/entities/TeacherApplication";
import { TeacherApplicationDocument } from "../database/models/TeacherApplicationModel";

export class TeacherApplicationPersistenceMapper {

    static toDomain(
        document: TeacherApplicationDocument
    ): TeacherApplication {

        return {
            applicationId: document._id.toString(),

            userId: document.userId.toString(),

            qualification: document.qualification,
            experience: document.experience,

            skills: document.skills,
            bio: document.bio,

            documents: document.documents,
            certificates: document.certificates,

            status: document.status as TeacherApplication["status"],

            rejectionReason: document.rejectionReason,

            createdAt: document.createdAt,
            updatedAt: document.updatedAt
        };
    }


    static toPersistence(
        application: TeacherApplication
    ) {

        return {
            userId: application.userId,

            qualification: application.qualification,
            experience: application.experience,

            skills: application.skills ?? [],

            bio: application.bio,

            documents: application.documents ?? [],
            certificates: application.certificates ?? [],

            status: application.status,

            rejectionReason: application.rejectionReason
        };
    }


    static toPersistenceUpdate(
        application: Partial<TeacherApplication>
    ) {

        const {
            applicationId: _applicationId,
            createdAt: _createdAt,
            updatedAt: _updatedAt,
            ...updateData
        } = application;

        return updateData;
    }
}