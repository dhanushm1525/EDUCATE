export type CourseLevel =
    | "Beginner"
    | "Intermediate"
    | "Advanced";

export type CourseStatus =
    | "draft"
    | "pending"
    | "published"
    | "rejected";

export interface Course {

    courseId: string;

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

    createdAt: string;

    updatedAt: string;
}

export interface CreateCourseRequest {

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

export type UpdateCourseRequest =
    Partial<CreateCourseRequest>;

export interface CourseApiResponse<T> {

    success: boolean;

    message: string;

    data: T;
}