
import { CreateCourseUseCase } from "../../application/use-cases/course/CreateCourseUseCase";
import { CreateCourseController } from "../../presentation/controllers/course/CreateCourseController";

import {
    chapterRepository,
    courseRepository,
    lessonRepository
} from "./repositoryDependencies";

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

import { GetPendingCoursesUseCase } from "../../application/use-cases/course/GetPendingCoursesUseCase";
import { GetPendingCoursesController } from "../../presentation/controllers/course/GetPendingCoursesController";

import { ApproveCourseUseCase } from "../../application/use-cases/course/ApproveCourseUseCase";
import { ApproveCourseController } from "../../presentation/controllers/course/ApproveCourseController";

import { RejectCourseUseCase } from "../../application/use-cases/course/RejectCourseUseCase";
import { RejectCourseController } from "../../presentation/controllers/course/RejectCourseController";

import { GetTeacherCourseByIdUseCase } from "../../application/use-cases/course/GetTeacherCourseByIdUseCase";
import { GetTeacherCourseByIdController } from "../../presentation/controllers/course/GetTeacherCourseByIdController";

import { GetCourseLearningContentUseCase } from "../../application/use-cases/course/GetCourseLearningContentUseCase";
import { GetCourseLearningContentController } from "../../presentation/controllers/course/GetCourseLearningContentController";

// Course thumbnail upload
import { GenerateCourseThumbnailUploadUrlUseCase } from "../../application/use-cases/course/GenerateCourseThumbnailUploadUrlUseCase";
import { GenerateCourseThumbnailUploadUrlController } from "../../presentation/controllers/course/GenerateCourseThumbnailUploadUrlController";

import { S3CourseThumbnailKeyPolicy } from "../services/CourseThumbnailKeyPolicy";
import { CourseThumbnailTypePolicy } from "../services/CourseThumbnailTypePolicy";

// Storage dependencies
import { s3StorageService, s3Client } from "./storageDependencies";

import { env } from "../config/env";

// Course response service
import { CourseResponseService } from "../../application/services/CourseResponseService";


// ============================================
// COURSE STATUS POLICY
// ============================================

const courseStatusPolicy = new DefaultCourseStatusPolicy();


// ============================================
// COURSE RESPONSE SERVICE
// ============================================

export const courseResponseService =
    new CourseResponseService(s3StorageService);


// ============================================
// COURSE CREATION
// ============================================

export const createCourseUseCase =
    new CreateCourseUseCase(courseRepository);

export const createCourseController =
    new CreateCourseController(
        createCourseUseCase,
        courseResponseService
    );


// ============================================
// COURSE UPDATE
// ============================================

export const updateCourseUseCase =
    new UpdateCourseUseCase(
        courseRepository,
        courseStatusPolicy
    );

export const updateCourseController =
    new UpdateCourseController(
        updateCourseUseCase,
        courseResponseService
    );

// ============================================
// COURSE SUBMISSION
// ============================================

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
        submitCourseUseCase,
        courseResponseService
    );


// ============================================
// TEACHER COURSES
// ============================================

export const getMyCoursesUseCase =
    new GetMyCoursesUseCase(courseRepository);

export const getMyCoursesController =
    new GetMyCoursesController(
        getMyCoursesUseCase,
        courseResponseService
    );


export const getTeacherCourseByIdUseCase =
    new GetTeacherCourseByIdUseCase(courseRepository);

export const getTeacherCourseByIdController =
    new GetTeacherCourseByIdController(
        getTeacherCourseByIdUseCase,
        courseResponseService
    );


// ============================================
// PUBLIC COURSES
// ============================================

export const getPublishedCoursesUseCase =
    new GetPublishedCoursesUseCase(courseRepository);

export const getPublishedCoursesController =
    new GetPublishedCoursesController(
        getPublishedCoursesUseCase,
        courseResponseService
    );


export const getPublishedCourseByIdUseCase =
    new GetPublishedCourseByIdUseCase(courseRepository);

export const getPublishedCourseByIdController =
    new GetPublishedCourseByIdController(
        getPublishedCourseByIdUseCase,
        courseResponseService
    );


// ============================================
// ADMIN COURSE MANAGEMENT
// ============================================

export const getPendingCoursesUseCase =
    new GetPendingCoursesUseCase(courseRepository);

export const getPendingCoursesController =
    new GetPendingCoursesController(
        getPendingCoursesUseCase,
        courseResponseService
    );


export const approveCourseUseCase =
    new ApproveCourseUseCase(courseRepository);

export const approveCourseController =
    new ApproveCourseController(
        approveCourseUseCase,
        courseResponseService
    );


export const rejectCourseUseCase =
    new RejectCourseUseCase(courseRepository);

export const rejectCourseController =
    new RejectCourseController(
        rejectCourseUseCase,
        courseResponseService
    );


// ============================================
// COURSE LEARNING CONTENT
// ============================================

export const getCourseLearningContentUseCase =
    new GetCourseLearningContentUseCase(
        courseRepository,
        chapterRepository,
        lessonRepository,
        s3StorageService
    );

export const getCourseLearningContentController =
    new GetCourseLearningContentController(
        getCourseLearningContentUseCase
    );


// ============================================
// COURSE THUMBNAIL UPLOAD
// ============================================

const courseThumbnailKeyPolicy =
    new S3CourseThumbnailKeyPolicy();

const courseThumbnailTypePolicy =
    new CourseThumbnailTypePolicy();

export const generateCourseThumbnailUploadUrlUseCase =
    new GenerateCourseThumbnailUploadUrlUseCase(
        courseRepository,
        courseStatusPolicy,
        s3Client,
        courseThumbnailKeyPolicy,
        courseThumbnailTypePolicy,
        env.awsS3BucketName
    );

export const generateCourseThumbnailUploadUrlController =
    new GenerateCourseThumbnailUploadUrlController(
        generateCourseThumbnailUploadUrlUseCase
    );
