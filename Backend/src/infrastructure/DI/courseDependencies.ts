import { CreateCourseUseCase } from "../../application/use-cases/course/CreateCourseUseCase";
import { CreateCourseController } from "../../presentation/controllers/course/CreateCourseController";

import { courseRepository } from "./repositoryDependencies";

import { UpdateCourseUseCase } from "../../application/use-cases/course/UpdateCourseUseCase";
import { UpdateCourseController } from "../../presentation/controllers/course/UpdateCourseController";

export const createCourseUseCase =
    new CreateCourseUseCase(courseRepository);

export const createCourseController =
    new CreateCourseController(createCourseUseCase);

export const updateCourseUseCase =
    new UpdateCourseUseCase(courseRepository);

export const updateCourseController =
    new UpdateCourseController(updateCourseUseCase);