import { CourseLevel } from "../../shared/enums/CourseLevel";
import { CourseStatus } from "../../shared/enums/CourseStatus";

export interface Course {
    courseId?: string;

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
    finalPrice: number;

    tags?: string[];

    objectives?: string[];
    requirements?: string[];

    featured?: boolean;

    averageRating?: number;
    totalStudents?: number;

    status: CourseStatus;
    rejectionReason?: string;

    createdAt: Date;
    updatedAt: Date;
}