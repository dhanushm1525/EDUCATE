
import { Enrollment } from "../../domain/entities/Enrollment";
import { EnrollmentDocument } from "../database/models/EnrollmentModel";

export class EnrollmentPersistenceMapper {
    static toDomain(document: EnrollmentDocument): Enrollment {
        return {
            enrollmentId: document._id.toString(),
            userId: document.userId.toString(),
            courseId: document.courseId.toString(),
            status: document.status,
            enrolledAt: document.enrolledAt,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        };
    }

    static toPersistence(enrollment: Enrollment) {
        return {
            userId: enrollment.userId,
            courseId: enrollment.courseId,
            status: enrollment.status,
            enrolledAt: enrollment.enrolledAt,
        };
    }

    static toPersistenceUpdate(enrollment: Partial<Enrollment>) {
        const {
            enrollmentId: _enrollmentId,
            userId: _userId,
            courseId: _courseId,
            createdAt: _createdAt,
            updatedAt: _updatedAt,
            ...updateData
        } = enrollment;

        return updateData;
    }
}
