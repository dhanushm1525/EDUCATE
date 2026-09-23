import { CourseLevel } from "../../../shared/enums/CourseLevel";

export interface CreateCourseDTO {

    teacherId: string;
    categoryId: string;

    title: string;
    subtitle: string;
    description: string;

    thumbnail?: string;
    trailer?: string;

    language: string;
    level: CourseLevel;

    duration: number;

    price: number;
    discount: number;

    tags?: string[];

    objectives?: string[];
    requirements?: string[];
}