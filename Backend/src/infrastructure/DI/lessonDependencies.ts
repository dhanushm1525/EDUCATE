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

import { GetLessonByIdUseCase } from "../../application/use-cases/lesson/GetLessonsByIdUseCase";

import { GetLessonByIdController } from "../../presentation/controllers/lesson/GetLessonByIdController";

import { UpdateLessonUseCase } from "../../application/use-cases/lesson/UpdateLessonUseCase";

import { UpdateLessonController } from "../../presentation/controllers/lesson/UpdateLessonController";

import { DeleteLessonUseCase } from "../../application/use-cases/lesson/DeleteLessonUseCase";

import { DeleteLessonController } from "../../presentation/controllers/lesson/DeleteLessonController";

import { GenerateLessonMediaUploadUrlUseCase } from "../../application/use-cases/lesson/GenerateLessonMediaUploadUrlUseCase";

import { GenerateLessonMediaUploadUrlController } from "../../presentation/controllers/lesson/GenerateLessonMediaUploadUrlController";

import { LessonMediaTypePolicy } from "../services/LessonMediaTypePolicy";

import { S3LessonMediaKeyPolicy } from "../services/LessonMediaKeyPolicy";

import { s3Client } from "./storageDependencies";

import { env } from "../config/env";

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



export const getLessonByIdUseCase =
    new GetLessonByIdUseCase(
        lessonRepository,
        chapterRepository,
        courseRepository
    );

export const getLessonByIdController =
    new GetLessonByIdController(
        getLessonByIdUseCase
    );

 
const lessonMediaKeyPolicy = new S3LessonMediaKeyPolicy();

export const updateLessonUseCase =
    new UpdateLessonUseCase(
        lessonRepository,
        chapterRepository,
        courseRepository,
        courseStatusPolicy,
        lessonMediaKeyPolicy
    );

export const updateLessonController =
    new UpdateLessonController(
        updateLessonUseCase
    );


export const deleteLessonUseCase =
    new DeleteLessonUseCase(
        lessonRepository,
        chapterRepository,
        courseRepository,
        courseStatusPolicy
    );

export const deleteLessonController =
    new DeleteLessonController(
        deleteLessonUseCase
    );


const lessonMediaTypePolicy = new LessonMediaTypePolicy();



export const generateLessonMediaUploadUrlUseCase =
    new GenerateLessonMediaUploadUrlUseCase(
        lessonRepository,
        chapterRepository,
        courseRepository,
        courseStatusPolicy,
        s3Client,
        lessonMediaTypePolicy,
        lessonMediaKeyPolicy,
        env.awsS3BucketName
    );

export const generateLessonMediaUploadUrlController =
    new GenerateLessonMediaUploadUrlController(
        generateLessonMediaUploadUrlUseCase
    );