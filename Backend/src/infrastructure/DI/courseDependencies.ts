import { CreateCourseUseCase } from "../../application/use-cases/course/CreateCourseUseCase";
import { CreateCourseController } from "../../presentation/controllers/course/CreateCourseController";

import { chapterRepository, courseRepository, lessonRepository } from "./repositoryDependencies";

import { UpdateCourseUseCase } from "../../application/use-cases/course/UpdateCourseUseCase";
import { UpdateCourseController } from "../../presentation/controllers/course/UpdateCourseController";
import { DefaultCourseStatusPolicy } from "../../domain/policies/CourseStatusPolicy";
import { SubmitCourseUseCase } from "../../application/use-cases/course/SubmitCourseUseCase";
import { SubmitCourseController } from "../../presentation/controllers/course/SubmitCourseController";
import { assignmentRepository } from "./assignmentDependencies";
import { GetMyCoursesUseCase } from "../../application/use-cases/course/GetMyCoursesUseCase";
import { GetMyCoursesController } from "../../presentation/controllers/course/GetMyCoursesController";
import { GetPublishedCoursesUseCase } from "../../application/use-cases/course/GetPublishedCoursesUseCase";
import { GetPublishedCoursesController } from "../../presentation/controllers/course/GetPublishedCoursesController";

import { GetPublishedCourseByIdUseCase } from "../../application/use-cases/course/GetPublishedCourseByIdUseCase";
import { GetPublishedCourseByIdController } from "../../presentation/controllers/course/GetPublishedCourseByIdController";



export const getMyCoursesUseCase =
    new GetMyCoursesUseCase(courseRepository);

export const createCourseUseCase =
    new CreateCourseUseCase(courseRepository);

export const createCourseController =
    new CreateCourseController(createCourseUseCase);

const courseStatusPolicy = new DefaultCourseStatusPolicy();

export const updateCourseUseCase =
    new UpdateCourseUseCase(courseRepository, courseStatusPolicy);

export const updateCourseController =
    new UpdateCourseController(updateCourseUseCase);




const submitCourseUseCase =
    new SubmitCourseUseCase(
        courseRepository,
        chapterRepository,
        lessonRepository,
        assignmentRepository,
        courseStatusPolicy
    );

export const submitCourseController =
    new SubmitCourseController(
        submitCourseUseCase
    );



export const getMyCoursesController =
    new GetMyCoursesController(getMyCoursesUseCase);


export const getPublishedCoursesUseCase =
    new GetPublishedCoursesUseCase(courseRepository);

export const getPublishedCoursesController =
    new GetPublishedCoursesController(getPublishedCoursesUseCase);


export const getPublishedCourseByIdUseCase =
    new GetPublishedCourseByIdUseCase(courseRepository);

export const getPublishedCourseByIdController =
    new GetPublishedCourseByIdController(
        getPublishedCourseByIdUseCase
    );