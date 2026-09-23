import { CreateCourseUseCase } from "../../application/use-cases/course/CreateCourseUseCase";
import { CreateCourseController } from "../../presentation/controllers/course/CreateCourseController";

import { courseRepository } from "./repositoryDependencies";

export const createCourseUseCase =
    new CreateCourseUseCase(courseRepository);

export const createCourseController =
    new CreateCourseController(createCourseUseCase);