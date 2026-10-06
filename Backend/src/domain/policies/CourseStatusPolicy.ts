import { CourseStatus } from "../../shared/enums/CourseStatus";

export interface ICourseStatusPolicy {
    canEdit(status: CourseStatus): boolean;
    canSubmit(status: CourseStatus): boolean;
}

export class DefaultCourseStatusPolicy implements ICourseStatusPolicy {

    private readonly _editableStatuses = new Set<CourseStatus>([
        CourseStatus.DRAFT,
        CourseStatus.REJECTED,
    ]);

    private readonly _submittableStatuses = new Set<CourseStatus>([
        CourseStatus.DRAFT,
        CourseStatus.REJECTED,
    ]);

    canEdit(status: CourseStatus): boolean {
        return this._editableStatuses.has(status);
    }

    canSubmit(status: CourseStatus): boolean {
        return this._submittableStatuses.has(status);
    }
}