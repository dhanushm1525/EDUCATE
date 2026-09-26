import { CreateLessonUseCase } from "../../application/use-cases/lesson/CreateLessonUseCase";

import { CreateLessonController } from "../../presentation/controllers/lesson/CreateLessonController";

import {
    lessonRepository,
    chapterRepository,
    courseRepository,
} from "./repositoryDependencies";

import { DefaultCourseStatusPolicy } from "../../domain/policies/CourseStatusPolicy";

import { GetLessonsByChapterUseCase } from "../../application/use-cases/lesson/GetLessonByChapterUseCase";

import { GetLessonsByChapterController } from "../../presentation/controllers/lesson/GetLessonsByChapterController";

const courseStatusPolicy =
    new DefaultCourseStatusPolicy();

export const createLessonUseCase =
    new CreateLessonUseCase(
        lessonRepository,
        chapterRepository,
        courseRepository,
        courseStatusPolicy
    );

export const createLessonController =
    new CreateLessonController(
        createLessonUseCase
    );

export const getLessonsByChapterUseCase =
    new GetLessonsByChapterUseCase(
        lessonRepository,
        chapterRepository,
        courseRepository
    );

export const getLessonsByChapterController =
    new GetLessonsByChapterController(
        getLessonsByChapterUseCase
    );