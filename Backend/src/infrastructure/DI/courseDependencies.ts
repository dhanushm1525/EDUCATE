import { CreateCourseUseCase } from "../../application/use-cases/course/CreateCourseUseCase";
import { CreateCourseController } from "../../presentation/controllers/course/CreateCourseController";

import { chapterRepository, courseRepository, lessonRepository } from "./repositoryDependencies";

import { UpdateCourseUseCase } from "../../application/use-cases/course/UpdateCourseUseCase";
import { UpdateCourseController } from "../../presentation/controllers/course/UpdateCourseController";
import { DefaultCourseStatusPolicy } from "../../domain/policies/CourseStatusPolicy";
import { SubmitCourseUseCase } from "../../application/use-cases/course/SubmitCourseUseCase";
import { SubmitCourseController } from "../../presentation/controllers/course/SubmitCourseController";

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
        courseStatusPolicy
    );

export const submitCourseController =
    new SubmitCourseController(
        submitCourseUseCase
    );