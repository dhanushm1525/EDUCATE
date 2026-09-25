import { CreateChapterUseCase } from "../../application/use-cases/chapter/CreateChapterUseCase";

import { CreateChapterController } from "../../presentation/controllers/chapter/CreateChapterController";

import { DefaultCourseStatusPolicy } from "../../domain/policies/CourseStatusPolicy";

import {
    chapterRepository,
    courseRepository,
} from "./repositoryDependencies";

const courseStatusPolicy = new DefaultCourseStatusPolicy();

export const createChapterUseCase = new CreateChapterUseCase(chapterRepository, courseRepository, courseStatusPolicy);

export const createChapterController = new CreateChapterController(createChapterUseCase);