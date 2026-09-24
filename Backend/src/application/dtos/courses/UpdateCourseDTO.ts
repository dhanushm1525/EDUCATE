import { CourseLevel } from "../../../shared/enums/CourseLevel";

export interface UpdateCourseDTO {
    title?: string;
    subtitle?: string;
    description?: string;

    categoryId?: string;

    thumbnail?: string;
    trailer?: string;

    language?: string;
    level?: CourseLevel;

    duration?: number;

    price?: number;
    discount?: number;

    tags?: string[];
    objectives?: string[];
    requirements?: string[];
}