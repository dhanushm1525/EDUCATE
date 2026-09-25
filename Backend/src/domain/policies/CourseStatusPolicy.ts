import { CourseStatus } from "../../shared/enums/CourseStatus";

export interface CourseStatusPolicy {
    canEdit(status: CourseStatus): boolean;
}

export class DefaultCourseStatusPolicy implements CourseStatusPolicy {
    private readonly editableStatuses = new Set<CourseStatus>([
        CourseStatus.DRAFT,
        CourseStatus.REJECTED,
    ]);

    canEdit(status: CourseStatus): boolean {
        return this.editableStatuses.has(status);
    }
}
