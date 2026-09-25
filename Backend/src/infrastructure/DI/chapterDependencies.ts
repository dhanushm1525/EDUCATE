import { CreateChapterUseCase } from "../../application/use-cases/chapter/CreateChapterUseCase";

import { CreateChapterController} from "../../presentation/controllers/chapter/CreateChapterController";

import { DefaultCourseStatusPolicy } from "../../domain/policies/CourseStatusPolicy";

import { GetChaptersByCourseUseCase } from "../../application/use-cases/chapter/GetChaptersByCourseUseCase";

import { GetChaptersByCourseController } from "../../presentation/controllers/chapter/GetChaptersByCourseController";

import {chapterRepository,courseRepository,} from "./repositoryDependencies";

import { GetChapterByIdUseCase } from "../../application/use-cases/chapter/GetChapterByIdUseCase";

import { GetChapterByIdController } from "../../presentation/controllers/chapter/GetChapterByIdController";

const courseStatusPolicy = new DefaultCourseStatusPolicy();

export const createChapterUseCase = new CreateChapterUseCase(chapterRepository, courseRepository, courseStatusPolicy);

export const createChapterController = new CreateChapterController(createChapterUseCase);

export const getChaptersByCourseUseCase = new GetChaptersByCourseUseCase(chapterRepository, courseRepository
);

export const getChaptersByCourseController = new GetChaptersByCourseController(getChaptersByCourseUseCase);


export const getChapterByIdUseCase = new GetChapterByIdUseCase(chapterRepository,courseRepository);

export const getChapterByIdController = new GetChapterByIdController(getChapterByIdUseCase);