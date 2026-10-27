
export enum EnrollmentStatus {
    ACTIVE = "active",
    PENDING = "pending",
    CANCELLED = "cancelled",
}

export interface Enrollment {
    enrollmentId?: string;

    userId: string;
    courseId: string;

    status: EnrollmentStatus;

    enrolledAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
