
import { EnrollInCourseUseCase } from "../../application/use-cases/enrollment/EnrollInCourseUseCase";
import { EnrollInCourseController } from "../../presentation/controllers/enrollment/EnrollInCourseController";

import {
    enrollmentRepository,
    courseRepository,
} from "./repositoryDependencies";

import { GetMyEnrolledCoursesUseCase } from "../../application/use-cases/enrollment/GetMyEnrolledCoursesUseCase";
import { GetMyEnrolledCoursesController } from "../../presentation/controllers/enrollment/GetMyEnrolledCoursesController";

// Shared course response service
import { courseResponseService } from "./courseDependencies";

export const enrollInCourseUseCase = new EnrollInCourseUseCase(
    enrollmentRepository,
    courseRepository
);

export const enrollInCourseController = new EnrollInCourseController(
    enrollInCourseUseCase
);

export const getMyEnrolledCoursesUseCase =
    new GetMyEnrolledCoursesUseCase(
        enrollmentRepository,
        courseRepository
    );

export const getMyEnrolledCoursesController =
    new GetMyEnrolledCoursesController(
        getMyEnrolledCoursesUseCase,
        courseResponseService
    );
