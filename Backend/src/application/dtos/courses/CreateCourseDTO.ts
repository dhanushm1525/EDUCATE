import { CourseLevel } from "../../../shared/enums/CourseLevel";

export interface CreateCourseDTO {
    title: string;
    subtitle: string;
    description: string;

    categoryId: string;

    language: string;
    level: CourseLevel;

    duration: number;

    price: number;
    discount: number;

    tagIds: string[];

    objectives: string[];
    requirements: string[];
}